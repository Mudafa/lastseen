from fastapi import APIRouter

from app.models.schemas import RecentEventsResponse

router = APIRouter()


@router.get("/api/recent-events", response_model=RecentEventsResponse)
async def recent_events() -> RecentEventsResponse:
    # TODO: fetch from Supabase object_events ordered by created_at desc
    return RecentEventsResponse(events=[])
