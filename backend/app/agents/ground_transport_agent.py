from app.agents.state import TripState
from app.models.schemas import AgentStep, GroundTransportSummary
from app.services.locations import is_india
from app.services.ground_transport_estimator import estimate_ground_transport


async def ground_transport_agent_node(state: TripState) -> dict:
    origin_is_india = is_india(state["origin"])
    dest_is_india = is_india(state["destination"])

    if not (origin_is_india and dest_is_india):
        return {
            "ground_transport": GroundTransportSummary(applicable=False),
            "agent_log": [
                AgentStep(
                    agent="Ground Transport Agent",
                    status="skipped",
                    summary="Not applicable — this agent only covers domestic India routes",
                )
            ],
        }

    try:
        trains, buses, note = await estimate_ground_transport(
            state.get("origin_label") or state["origin"],
            state["destination_label"],
        )
        summary_parts = []
        if trains:
            summary_parts.append(f"{len(trains)} train option(s)")
        if buses:
            summary_parts.append(f"{len(buses)} bus option(s)")
        summary = (
            ", ".join(summary_parts) if summary_parts else "No good rail/road options found"
        )

        return {
            "ground_transport": GroundTransportSummary(
                applicable=True, trains=trains, buses=buses, note=note
            ),
            "agent_log": [
                AgentStep(
                    agent="Ground Transport Agent", status="done", summary=summary
                )
            ],
        }
    except Exception as e:
        return {
            "ground_transport": GroundTransportSummary(applicable=True),
            "agent_log": [
                AgentStep(
                    agent="Ground Transport Agent", status="error", summary=str(e)
                )
            ],
            "errors": [f"Ground Transport Agent: {e}"],
        }
