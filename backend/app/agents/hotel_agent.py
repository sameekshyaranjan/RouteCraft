import datetime
from app.agents.state import TripState
from app.models.schemas import AgentStep
from app.services.hotel_estimator import estimate_hotels


async def hotel_agent_node(state: TripState) -> dict:
    nights = max(
        1,
        (
            datetime.date.fromisoformat(state["end_date"])
            - datetime.date.fromisoformat(state["start_date"])
        ).days,
    )
    try:
        hotels = await estimate_hotels(
            state["destination_label"], nights, state["travelers"]
        )
        if hotels:
            cheapest = min(h.price_usd_per_night for h in hotels)
            summary = f"Estimated {len(hotels)} hotel option(s), from ${cheapest:.0f}/night"
        else:
            summary = "Couldn't generate hotel estimates for this destination"
        return {
            "hotels": hotels,
            "agent_log": [
                AgentStep(agent="Hotel Agent", status="done", summary=summary)
            ],
        }
    except Exception as e:
        return {
            "hotels": [],
            "agent_log": [
                AgentStep(agent="Hotel Agent", status="error", summary=str(e))
            ],
            "errors": [f"Hotel Agent: {e}"],
        }
