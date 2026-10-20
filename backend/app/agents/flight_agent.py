from app.agents.state import TripState
from app.models.schemas import AgentStep
from app.services.flight_data import search_flights


async def flight_agent_node(state: TripState) -> dict:
    try:
        flights = await search_flights(
            state["origin"],
            state["destination"],
            state["start_date"],
            state["end_date"],
            state["travelers"],
        )
        if flights:
            summary = f"Found {len(flights)} flight option(s), from ${min(f.price_usd for f in flights):.0f}"
        else:
            summary = (
                "No cached flight prices found for this exact route/dates "
                "(the free data source only has what other travelers have "
                "recently searched)"
            )
        return {
            "flights": flights,
            "agent_log": [
                AgentStep(agent="Flight Agent", status="done", summary=summary)
            ],
        }
    except Exception as e:
        return {
            "flights": [],
            "agent_log": [
                AgentStep(agent="Flight Agent", status="error", summary=str(e))
            ],
            "errors": [f"Flight Agent: {e}"],
        }
