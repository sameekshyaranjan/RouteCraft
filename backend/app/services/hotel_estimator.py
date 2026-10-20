import json
import asyncio
from langchain_core.messages import SystemMessage, HumanMessage

from app.services.llm import get_llm
from app.models.schemas import HotelOption

SYSTEM_PROMPT = """You are a travel pricing analyst. Given a destination,
dates, and number of travelers, produce 5 realistic hotel options spanning
budget to upscale — grounded in what that destination's hotel market
actually looks like (real neighborhood names, realistic price bands for
that specific city and star rating).

Respond with ONLY a JSON array, no prose, no markdown fences. Each item:
{"name": string, "price_usd_per_night": number, "rating": number (1-5,
one decimal), "address": string (neighborhood/area name only, no fake
street numbers)}

These are estimates for budgeting purposes, not live availability — do not
invent specific booking details or claim these are bookable right now.
"""


def _call_llm_sync(destination_label: str, nights: int, travelers: int) -> str:
    llm = get_llm(temperature=0.4)
    prompt = (
        f"Destination: {destination_label}\n"
        f"Stay length: {nights} night(s)\n"
        f"Travelers: {travelers}\n\n"
        "Give 5 realistic hotel price estimates now."
    )
    messages = [SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=prompt)]
    response = llm.invoke(messages)
    return response.content


def _parse_hotels(raw: str) -> list[HotelOption]:
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
    try:
        items = json.loads(text.strip())
    except json.JSONDecodeError:
        return []

    options: list[HotelOption] = []
    for item in items if isinstance(items, list) else []:
        try:
            options.append(
                HotelOption(
                    name=item["name"],
                    price_usd_per_night=round(float(item["price_usd_per_night"]), 2),
                    rating=float(item["rating"]) if item.get("rating") else None,
                    address=item.get("address", ""),
                )
            )
        except (KeyError, ValueError, TypeError):
            continue
    return options


async def estimate_hotels(
    destination_label: str, nights: int, travelers: int
) -> list[HotelOption]:
    raw = await asyncio.to_thread(
        _call_llm_sync, destination_label, nights, travelers
    )
    return _parse_hotels(raw)
