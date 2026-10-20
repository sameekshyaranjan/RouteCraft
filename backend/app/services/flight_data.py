import httpx
from app.config import settings
from app.models.schemas import FlightOption

PRICES_URL = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates"


async def _query_prices_for_dates(
    origin: str, destination: str, depart_date: str, return_date: str, travelers: int
) -> list[FlightOption]:
    params = {
        "origin": origin,
        "destination": destination,
        "departure_at": depart_date,
        "return_at": return_date,
        "one_way": "false",
        "direct": "false",
        "sorting": "price",
        "currency": "usd",
        "limit": 5,
        "token": settings.travelpayouts_token,
    }

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(PRICES_URL, params=params)
        resp.raise_for_status()
        data = resp.json()

    if not data.get("success"):
        raise RuntimeError(f"Travelpayouts flight search failed: {data.get('error')}")

    options: list[FlightOption] = []
    for offer in data.get("data", []):
        try:
            per_person = float(offer["price"])
            options.append(
                FlightOption(
                    airline=offer.get("airline", "?"),
                    price_usd=round(per_person * travelers, 2),
                    departure=offer["departure_at"],
                    arrival=offer.get("return_at") or offer["departure_at"],
                    duration=f"{offer.get('duration', 0)} min",
                    stops=offer.get("transfers", 0),
                    booking_hint=(
                        f"{offer.get('transfers', 0)} stop(s), "
                        f"{offer.get('airline', '')} — cached market price"
                    ),
                )
            )
        except (KeyError, ValueError, TypeError):
            continue

    return options


async def search_flights(
    origin: str,
    destination: str,
    depart_date: str,
    return_date: str,
    travelers: int,
) -> list[FlightOption]:
    """Real cached flight price data from Aviasales (via Travelpayouts).

    Note: this returns market prices found by real travelers searching
    these routes recently — genuine data, but not a live GDS booking
    search like Amadeus used to offer. Amadeus's free self-service tier
    was permanently shut down in July 2026.

    The cache only has data for date combinations someone has actually
    searched in roughly the last 48 hours, so an exact-date query on a
    less-traveled route/date can come back empty even though the route
    itself has data. If that happens, we retry at month-level granularity
    (YYYY-MM), which has a much higher hit rate — the results represent
    the cheapest fares found anywhere in that month rather than those
    exact dates.
    """
    if not settings.travelpayouts_token:
        raise RuntimeError(
            "TRAVELPAYOUTS_TOKEN missing. Get a free one at "
            "https://www.travelpayouts.com (Tools → API token) and add it "
            "to backend/.env"
        )

    options = await _query_prices_for_dates(
        origin, destination, depart_date, return_date, travelers
    )
    if options:
        return options

    # Fall back to month-level cache, which has far more coverage
    month_options = await _query_prices_for_dates(
        origin, destination, depart_date[:7], return_date[:7], travelers
    )
    for o in month_options:
        o.booking_hint += " (approx. — cheapest found that month, not these exact dates)"
    return month_options
