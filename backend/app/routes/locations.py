from fastapi import APIRouter, Query
from pydantic import BaseModel

from app.services.locations import search_locations

router = APIRouter(prefix="/api/locations", tags=["locations"])


class LocationOut(BaseModel):
    code: str
    city: str
    country: str
    country_code: str
    label: str


@router.get("/search", response_model=list[LocationOut])
async def search(q: str = Query(default="", min_length=0)):
    if len(q.strip()) < 2:
        return []
    results = search_locations(q, limit=8)
    return [
        LocationOut(
            code=loc.code,
            city=loc.city,
            country=loc.country,
            country_code=loc.country_code,
            label=f"{loc.city}, {loc.country}",
        )
        for loc in results
    ]
