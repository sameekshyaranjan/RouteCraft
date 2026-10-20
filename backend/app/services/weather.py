import datetime
import httpx
from app.models.schemas import WeatherSummary

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"

WEATHER_CODES = {
    0: "clear sky",
    1: "mostly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "foggy",
    48: "foggy",
    51: "light drizzle",
    61: "light rain",
    63: "moderate rain",
    65: "heavy rain",
    71: "light snow",
    73: "moderate snow",
    75: "heavy snow",
    80: "rain showers",
    95: "thunderstorms",
}


async def _geocode(place: str) -> tuple[float, float] | None:
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(GEOCODE_URL, params={"name": place, "count": 1})
        resp.raise_for_status()
        data = resp.json()
    results = data.get("results")
    if not results:
        return None
    return results[0]["latitude"], results[0]["longitude"]


async def get_weather_summary(
    destination_label: str, start_date: str, end_date: str
) -> WeatherSummary | None:
    coords = await _geocode(destination_label)
    if not coords:
        return None
    lat, lon = coords

    today = datetime.date.today()
    start = datetime.date.fromisoformat(start_date)
    days_out = (start - today).days

    async with httpx.AsyncClient(timeout=10) as client:
        if 0 <= days_out <= 15:
            # Within forecast range — use live forecast
            resp = await client.get(
                FORECAST_URL,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "start_date": start_date,
                    "end_date": end_date,
                    "daily": "temperature_2m_max,temperature_2m_min,weathercode",
                    "timezone": "auto",
                },
            )
            label_suffix = ""
        else:
            # Outside forecast range — use last year's same dates as a
            # historical-average proxy.
            last_year = start.year - 1
            hist_start = f"{last_year}-{start_date[5:]}"
            hist_end = f"{last_year}-{end_date[5:]}"
            resp = await client.get(
                ARCHIVE_URL,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "start_date": hist_start,
                    "end_date": hist_end,
                    "daily": "temperature_2m_max,temperature_2m_min,weathercode",
                    "timezone": "auto",
                },
            )
            label_suffix = " (historical average for these dates)"

        resp.raise_for_status()
        data = resp.json()

    daily = data.get("daily", {})
    highs = daily.get("temperature_2m_max", [])
    lows = daily.get("temperature_2m_min", [])
    codes = daily.get("weathercode", [])

    if not highs or not lows:
        return None

    avg_high = sum(highs) / len(highs)
    avg_low = sum(lows) / len(lows)
    common_code = max(set(codes), key=codes.count) if codes else 0
    conditions = WEATHER_CODES.get(common_code, "variable conditions") + label_suffix

    return WeatherSummary(
        avg_high_c=round(avg_high, 1),
        avg_low_c=round(avg_low, 1),
        conditions=conditions,
    )
