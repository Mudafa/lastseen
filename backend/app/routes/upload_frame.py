from fastapi import APIRouter, File, UploadFile

from app.config import get_settings
from app.models.schemas import FrameScanStatus, UploadFrameResponse
from app.services import image_compare

router = APIRouter()

# In-memory previous frame per process (MVP). Replace with Redis/DB for multi-worker.
_previous_frame: bytes | None = None


@router.post("/api/upload-frame", response_model=UploadFrameResponse)
async def upload_frame(file: UploadFile = File(...)) -> UploadFrameResponse:
    global _previous_frame

    settings = get_settings()
    image_bytes = await file.read()

    difference_score = image_compare.compute_difference_score(_previous_frame, image_bytes)
    status = image_compare.classify_frame(difference_score, settings)

    _previous_frame = image_bytes

    if status == FrameScanStatus.IGNORED:
        return UploadFrameResponse(
            status=status,
            difference_score=difference_score,
            events_saved=0,
            message="Frame unchanged enough — ignored.",
        )

    if status == FrameScanStatus.SAVED_NO_AI:
        return UploadFrameResponse(
            status=status,
            difference_score=difference_score,
            events_saved=0,
            message="Frame changed — saved for later (AI scan skipped at this threshold).",
        )

    # TODO: upload to Supabase Storage, run AI vision, save object_events
    return UploadFrameResponse(
        status=FrameScanStatus.PROCESSED,
        difference_score=difference_score,
        events_saved=0,
        message="Frame changed enough — ready for AI analysis (not wired yet).",
    )
