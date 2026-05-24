from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import RecentEventsResponse
from app.services import events_repository
from app.services.supabase_client import require_supabase

router = APIRouter()


@router.get("/api/recent-events", response_model=RecentEventsResponse)
async def recent_events(limit: int = Query(default=50, ge=1, le=200)) -> RecentEventsResponse:
    try:
        client = require_supabase()
        events = events_repository.fetch_recent_events(client, limit=limit)
        return RecentEventsResponse(events=events)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
