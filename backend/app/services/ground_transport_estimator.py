import json
import asyncio
from langchain_core.messages import SystemMessage, HumanMessage

from app.services.llm import get_llm
from app.models.schemas import TrainOption, BusOption

SYSTEM_PROMPT = """You are a travel analyst specializing in Indian domestic
travel. Given an origin and destination city in India, list realistic train
and bus options — grounded in how Indian Railways and interstate bus
services actually operate on that kind of route (real train categories
like Rajdhani/Shatabdi/Vande Bharat/Duronto/regular Express where
plausible, real bus operator types like Volvo AC Sleeper/state transport
corporation buses).

If the origin and destination are extremely far apart or not well
connected by rail/road (e.g. across the sea to an island territory), say
so honestly in the note field and return fewer or no options rather than
inventing implausible ones.

Respond with ONLY a JSON object, no prose, no markdown fences, in this
exact shape:
{
  "trains": [
    {"train_name": string, "train_type": string, "duration": string,
     "price_usd_range": string, "frequency": string}
  ],
  "buses": [
    {"operator_type": string, "duration": string, "price_usd_range": string}
  ],
  "note": string
}

Give up to 3 train options and up to 2 bus options. These are estimates
for planning purposes, not live schedules or bookable tickets — do not
invent exact departure times or claim real-time availability.
"""


def _call_llm_sync(origin_label: str, destination_label: str) -> str:
    llm = get_llm(temperature=0.3)
    prompt = f"Origin: {origin_label}\nDestination: {destination_label}\n\nGive train and bus options now."
    messages = [SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=prompt)]
    response = llm.invoke(messages)
    return response.content


def _parse(raw: str) -> dict:
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        return {"trains": [], "buses": [], "note": ""}


async def estimate_ground_transport(
    origin_label: str, destination_label: str
) -> tuple[list[TrainOption], list[BusOption], str]:
    raw = await asyncio.to_thread(_call_llm_sync, origin_label, destination_label)
    data = _parse(raw)

    trains: list[TrainOption] = []
    for t in data.get("trains", []):
        try:
            trains.append(TrainOption(**t))
        except (TypeError, ValueError):
            continue

    buses: list[BusOption] = []
    for b in data.get("buses", []):
        try:
            buses.append(BusOption(**b))
        except (TypeError, ValueError):
            continue

    return trains, buses, data.get("note", "")
