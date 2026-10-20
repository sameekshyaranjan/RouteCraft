import uuid
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db, Trip, User
from app.auth.dependencies import get_current_user
from app.models.schemas import (
    TripRequest,
    TripResult,
    TripSummaryOut,
    TripDetailOut,
)
from app.agents.graph import run_trip_planner

router = APIRouter(prefix="/api/trips", tags=["trips"])


@router.post("/plan", response_model=TripResult)
async def plan_trip(
    req: TripRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    trip_id = str(uuid.uuid4())

    trip_input = {
        "origin": req.origin.upper(),
        "origin_label": req.origin_label,
        "destination": req.destination.upper(),
        "destination_label": req.destination_label,
        "start_date": req.start_date,
        "end_date": req.end_date,
        "travelers": req.travelers,
        "budget_usd": req.budget_usd,
        "preferences": req.preferences,
        "agent_log": [],
        "errors": [],
    }

    try:
        final_state = await run_trip_planner(trip_input)
    except Exception as e:
        raise HTTPException(500, f"Trip planning pipeline failed: {e}")

    result = TripResult(
        trip_id=trip_id,
        destination_label=req.destination_label,
        start_date=req.start_date,
        end_date=req.end_date,
        travelers=req.travelers,
        budget_usd=req.budget_usd,
        flights=final_state.get("flights", []),
        hotels=final_state.get("hotels", []),
        weather=final_state.get("weather"),
        budget=final_state.get("budget"),
        ground_transport=final_state.get("ground_transport"),
        itinerary_markdown=final_state.get("itinerary_markdown", ""),
        agent_log=final_state.get("agent_log", []),
    )

    trip = Trip(
        id=trip_id,
        user_id=user.id,
        origin=req.origin.upper(),
        destination=req.destination.upper(),
        destination_label=req.destination_label,
        start_date=req.start_date,
        end_date=req.end_date,
        travelers=req.travelers,
        budget_usd=req.budget_usd,
        preferences=req.preferences,
        status="complete" if not final_state.get("errors") else "complete_with_errors",
        result_json=result.model_dump_json(),
    )
    db.add(trip)
    await db.commit()

    return result


@router.get("", response_model=list[TripSummaryOut])
async def list_trips(
    db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Trip).where(Trip.user_id == user.id).order_by(Trip.created_at.desc())
    )
    trips = result.scalars().all()
    return [
        TripSummaryOut(
            id=t.id,
            destination_label=t.destination_label,
            start_date=t.start_date,
            end_date=t.end_date,
            status=t.status,
            created_at=t.created_at.isoformat(),
        )
        for t in trips
    ]


@router.get("/{trip_id}", response_model=TripDetailOut)
async def get_trip(
    trip_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Trip).where(Trip.id == trip_id, Trip.user_id == user.id)
    )
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(404, "Trip not found")

    return TripDetailOut(
        id=trip.id,
        destination_label=trip.destination_label,
        start_date=trip.start_date,
        end_date=trip.end_date,
        status=trip.status,
        created_at=trip.created_at.isoformat(),
        origin=trip.origin,
        destination=trip.destination,
        travelers=trip.travelers,
        budget_usd=trip.budget_usd,
        preferences=trip.preferences,
        result=json.loads(trip.result_json),
    )


@router.delete("/{trip_id}")
async def delete_trip(
    trip_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Trip).where(Trip.id == trip_id, Trip.user_id == user.id)
    )
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(404, "Trip not found")
    await db.delete(trip)
    await db.commit()
    return {"ok": True}
