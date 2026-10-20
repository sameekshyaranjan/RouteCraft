from pydantic import BaseModel
from typing import Optional, Any


class GoogleLoginRequest(BaseModel):
    credential: str  # Google ID token from the frontend


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    user: UserOut


class TripRequest(BaseModel):
    origin: str  # IATA code, e.g. "DEL"
    origin_label: str = ""  # human-readable, e.g. "New Delhi, India"
    destination: str  # IATA code, e.g. "BKK"
    destination_label: str  # human-readable, e.g. "Bangkok, Thailand"
    start_date: str  # YYYY-MM-DD
    end_date: str  # YYYY-MM-DD
    travelers: int = 1
    budget_usd: Optional[float] = None
    preferences: str = ""  # free text: "budget travel, street food, museums"


class AgentStep(BaseModel):
    agent: str
    status: str  # "running" | "done" | "error"
    summary: str = ""


class FlightOption(BaseModel):
    airline: str
    price_usd: float
    departure: str
    arrival: str
    duration: str
    stops: int
    booking_hint: str = ""


class HotelOption(BaseModel):
    name: str
    price_usd_per_night: float
    rating: Optional[float] = None
    address: str = ""


class WeatherSummary(BaseModel):
    avg_high_c: float
    avg_low_c: float
    conditions: str


class BudgetBreakdown(BaseModel):
    flights_total: float
    hotel_total: float
    estimated_extras: float
    grand_total: float
    within_budget: Optional[bool] = None
    notes: str = ""


class TrainOption(BaseModel):
    train_name: str
    train_type: str  # e.g. "Rajdhani Express", "Vande Bharat", "Shatabdi"
    duration: str
    price_usd_range: str  # e.g. "$8-25 depending on class"
    frequency: str = ""  # e.g. "daily"


class BusOption(BaseModel):
    operator_type: str  # e.g. "Volvo AC Sleeper", "State transport"
    duration: str
    price_usd_range: str


class GroundTransportSummary(BaseModel):
    applicable: bool = False
    trains: list[TrainOption] = []
    buses: list[BusOption] = []
    note: str = ""


class TripResult(BaseModel):
    trip_id: str
    destination_label: str
    start_date: str = ""
    end_date: str = ""
    travelers: int = 1
    budget_usd: Optional[float] = None
    flights: list[FlightOption]
    hotels: list[HotelOption]
    weather: Optional[WeatherSummary] = None
    budget: Optional[BudgetBreakdown] = None
    ground_transport: Optional[GroundTransportSummary] = None
    itinerary_markdown: str
    agent_log: list[AgentStep] = []


class TripSummaryOut(BaseModel):
    id: str
    destination_label: str
    start_date: str
    end_date: str
    status: str
    created_at: str


class TripDetailOut(TripSummaryOut):
    origin: str
    destination: str
    travelers: int
    budget_usd: Optional[float] = None
    preferences: str
    result: Any = None
