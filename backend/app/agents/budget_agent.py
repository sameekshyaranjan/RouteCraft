import datetime
from app.agents.state import TripState
from app.models.schemas import AgentStep, BudgetBreakdown


async def budget_agent_node(state: TripState) -> dict:
    flights = state.get("flights") or []
    hotels = state.get("hotels") or []
    travelers = state.get("travelers", 1)
    budget = state.get("budget_usd")

    nights = max(
        1,
        (
            datetime.date.fromisoformat(state["end_date"])
            - datetime.date.fromisoformat(state["start_date"])
        ).days,
    )

    flights_total = min((f.price_usd for f in flights), default=0.0) * travelers
    cheapest_hotel_per_night = min(
        (h.price_usd_per_night for h in hotels), default=0.0
    )
    hotel_total = cheapest_hotel_per_night * nights

    # Rough daily-extras estimate (food, local transit, activities)
    daily_extras = 45 * travelers
    estimated_extras = daily_extras * nights

    grand_total = flights_total + hotel_total + estimated_extras

    within_budget = None
    notes = ""
    if budget:
        within_budget = grand_total <= budget
        diff = abs(budget - grand_total)
        if within_budget:
            notes = f"${diff:.0f} under budget — some room for upgrades."
        else:
            notes = (
                f"${diff:.0f} over budget. Consider a cheaper hotel tier or "
                f"fewer flight stops to close the gap."
            )
    else:
        notes = "No budget was set — showing the estimated total cost."

    ground_transport = state.get("ground_transport")
    if ground_transport and ground_transport.applicable and (
        ground_transport.trains or ground_transport.buses
    ):
        notes += (
            " This is a domestic India route — taking the train or bus "
            "instead of flying could cut costs significantly; see the "
            "Ground Transport section."
        )

    breakdown = BudgetBreakdown(
        flights_total=round(flights_total, 2),
        hotel_total=round(hotel_total, 2),
        estimated_extras=round(estimated_extras, 2),
        grand_total=round(grand_total, 2),
        within_budget=within_budget,
        notes=notes,
    )

    return {
        "budget": breakdown,
        "agent_log": [
            AgentStep(
                agent="Budget Agent",
                status="done",
                summary=f"Estimated total: ${grand_total:.0f} ({nights} nights, {travelers} traveler(s))",
            )
        ],
    }
