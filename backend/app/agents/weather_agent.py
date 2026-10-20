from app.agents.state import TripState
from app.models.schemas import AgentStep
from app.services.weather import get_weather_summary


async def weather_agent_node(state: TripState) -> dict:
    try:
        weather = await get_weather_summary(
            state["destination_label"], state["start_date"], state["end_date"]
        )
        if weather:
            summary = (
                f"{weather.conditions}, {weather.avg_low_c:.0f}°–"
                f"{weather.avg_high_c:.0f}°C"
            )
        else:
            summary = "Couldn't resolve weather for this destination"
        return {
            "weather": weather,
            "agent_log": [
                AgentStep(agent="Weather Agent", status="done", summary=summary)
            ],
        }
    except Exception as e:
        return {
            "weather": None,
            "agent_log": [
                AgentStep(agent="Weather Agent", status="error", summary=str(e))
            ],
            "errors": [f"Weather Agent: {e}"],
        }
