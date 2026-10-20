import datetime
from app.agents.state import TripState
from app.models.schemas import AgentStep


async def supervisor_node(state: TripState) -> dict:
    start = datetime.date.fromisoformat(state["start_date"])
    end = datetime.date.fromisoformat(state["end_date"])
    nights = max(1, (end - start).days)

    summary = (
        f"Planning a {nights}-night trip to {state['destination_label']} "
        f"for {state['travelers']} traveler(s)"
    )
    if state.get("budget_usd"):
        summary += f", budget ${state['budget_usd']:.0f}"

    return {
        "agent_log": [
            AgentStep(agent="Supervisor", status="done", summary=summary)
        ]
    }
