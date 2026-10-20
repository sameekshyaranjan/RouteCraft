import operator
from typing import TypedDict, Optional, Annotated

from app.models.schemas import (
    FlightOption,
    HotelOption,
    WeatherSummary,
    BudgetBreakdown,
    GroundTransportSummary,
    AgentStep,
)


class TripState(TypedDict, total=False):
    # Input
    origin: str
    origin_label: str
    destination: str
    destination_label: str
    start_date: str
    end_date: str
    travelers: int
    budget_usd: Optional[float]
    preferences: str

    # Filled in by agents (flights/hotels/weather/ground_transport run in
    # parallel, each owns its own key so there's no write conflict)
    flights: list[FlightOption]
    hotels: list[HotelOption]
    weather: Optional[WeatherSummary]
    ground_transport: Optional[GroundTransportSummary]
    budget: Optional[BudgetBreakdown]
    itinerary_markdown: str

    # Shared, append-only across parallel branches
    agent_log: Annotated[list[AgentStep], operator.add]
    errors: Annotated[list[str], operator.add]
