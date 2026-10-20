import asyncio
import datetime
from langchain_core.messages import SystemMessage, HumanMessage

from app.agents.state import TripState
from app.models.schemas import AgentStep
from app.services.llm import get_llm

SYSTEM_PROMPT = """You are the Itinerary Agent inside RouteCraft, a multi-agent
AI travel planner. Other agents have already found flights, hotels, and
weather for this trip — your job is to turn that into a compelling,
practical day-by-day itinerary.

Rules:
- Write in markdown with a "### Day N" header per day.
- Under each day, suggest 2-4 concrete activities/sights with a short reason
  why they're worth it, roughly ordered through the day (morning/afternoon/
  evening — don't literally label them that way unless it helps).
- Weave in the weather (e.g. suggest indoor options if rain is likely) and
  the traveler's stated preferences.
- Keep it grounded — don't invent implausible logistics (e.g. don't have
  someone visit two far-apart cities in one day).
- End with a short "### Tips" section: 2-3 practical notes (packing, local
  transit, budget-saving ideas) relevant to this specific destination.
- Do not repeat the flight/hotel details verbatim — those are shown
  elsewhere in the UI. Focus on the experience.
"""


def _build_prompt(state: TripState) -> str:
    nights = max(
        1,
        (
            datetime.date.fromisoformat(state["end_date"])
            - datetime.date.fromisoformat(state["start_date"])
        ).days,
    )
    weather = state.get("weather")
    weather_line = (
        f"Expected weather: {weather.conditions}, {weather.avg_low_c:.0f}-{weather.avg_high_c:.0f}°C"
        if weather
        else "Weather data unavailable"
    )
    budget = state.get("budget")
    budget_line = (
        f"Estimated total cost: ${budget.grand_total:.0f} ({budget.notes})"
        if budget
        else ""
    )

    ground_transport = state.get("ground_transport")
    transport_line = ""
    if ground_transport and ground_transport.applicable:
        bits = []
        if ground_transport.trains:
            bits.append(
                "train options: "
                + "; ".join(
                    f"{t.train_type} (~{t.duration}, {t.price_usd_range})"
                    for t in ground_transport.trains
                )
            )
        if ground_transport.buses:
            bits.append(
                "bus options: "
                + "; ".join(
                    f"{b.operator_type} (~{b.duration}, {b.price_usd_range})"
                    for b in ground_transport.buses
                )
            )
        if bits:
            transport_line = (
                "This is a domestic India route — mention these ground "
                "transport alternatives to flying where relevant: "
                + " | ".join(bits)
            )

    return f"""Destination: {state['destination_label']}
Dates: {state['start_date']} to {state['end_date']} ({nights} nights)
Travelers: {state['travelers']}
Preferences: {state.get('preferences') or 'no specific preferences given'}
{weather_line}
{budget_line}
{transport_line}

Write the day-by-day itinerary now."""


def _call_llm_sync(state: TripState) -> str:
    llm = get_llm(temperature=0.5)
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=_build_prompt(state)),
    ]
    response = llm.invoke(messages)
    return response.content


async def itinerary_agent_node(state: TripState) -> dict:
    try:
        markdown = await asyncio.to_thread(_call_llm_sync, state)
        return {
            "itinerary_markdown": markdown,
            "agent_log": [
                AgentStep(
                    agent="Itinerary Agent",
                    status="done",
                    summary="Day-by-day itinerary drafted",
                )
            ],
        }
    except Exception as e:
        return {
            "itinerary_markdown": (
                "Couldn't generate an itinerary due to an error. Flights, "
                "hotels, weather, and budget above are still valid."
            ),
            "agent_log": [
                AgentStep(agent="Itinerary Agent", status="error", summary=str(e))
            ],
            "errors": [f"Itinerary Agent: {e}"],
        }
