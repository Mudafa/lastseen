from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.schemas import FrameScanStatus, UploadFrameResponse
from app.services.frame_pipeline import handle_upload

router = APIRouter()

_previous_frame: bytes | None = None


@router.post("/api/upload-frame", response_model=UploadFrameResponse)
async def upload_frame(file: UploadFile = File(...)) -> UploadFrameResponse:
    global _previous_frame

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image upload.")

    try:
        result, _previous_frame = await handle_upload(
            image_bytes,
            file.content_type,
            _previous_frame,
        )
        return result
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to process frame: {exc}") from exc
