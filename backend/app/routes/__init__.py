from fastapi import APIRouter

from app.routes.ask import router as ask_router
from app.routes.recent_events import router as recent_events_router
from app.routes.upload_frame import router as upload_frame_router

api_router = APIRouter()
api_router.include_router(upload_frame_router, tags=["frames"])
api_router.include_router(ask_router, tags=["ask"])
api_router.include_router(recent_events_router, tags=["events"])
