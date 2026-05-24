from app.config import Settings, get_settings
from app.models.schemas import FrameScanStatus, UploadFrameResponse
from app.services import ai_vision, events_repository, image_compare, storage
from app.services.supabase_client import require_supabase


async def handle_upload(
    image_bytes: bytes,
    content_type: str | None,
    previous_frame: bytes | None,
) -> tuple[UploadFrameResponse, bytes]:
    settings = get_settings()
    client = require_supabase(settings)

    difference_score = image_compare.compute_difference_score(previous_frame, image_bytes)
    status = image_compare.classify_frame(difference_score, settings)

    if status == FrameScanStatus.IGNORED:
        return (
            UploadFrameResponse(
                status=status,
                difference_score=difference_score,
                events_saved=0,
                message="Frame unchanged enough — ignored.",
            ),
            image_bytes,
        )

    image_url = storage.upload_frame_image(client, image_bytes, content_type, settings)

    if status == FrameScanStatus.SAVED_NO_AI:
        message = "Frame saved to storage. Change was below AI threshold."
        events_repository.insert_frame_scan(
            client,
            status=status,
            difference_score=difference_score,
            image_url=image_url,
            events_saved=0,
            message=message,
        )
        return (
            UploadFrameResponse(
                status=status,
                difference_score=difference_score,
                events_saved=0,
                message=message,
            ),
            image_bytes,
        )

    analysis = await ai_vision.analyze_frame(image_bytes)
    events_saved = events_repository.insert_object_events(
        client,
        analysis,
        image_url=image_url,
        difference_score=difference_score,
    )

    if events_saved > 0:
        message = f"Frame analyzed. Saved {events_saved} object event(s)."
    elif ai_vision.is_ai_configured(settings):
        message = "Frame analyzed. No object movement detected."
    else:
        message = "Frame saved. Add OPENAI_API_KEY or GEMINI_API_KEY to enable AI detection."

    events_repository.insert_frame_scan(
        client,
        status=FrameScanStatus.PROCESSED,
        difference_score=difference_score,
        image_url=image_url,
        events_saved=events_saved,
        message=message,
    )

    return (
        UploadFrameResponse(
            status=FrameScanStatus.PROCESSED,
            difference_score=difference_score,
            events_saved=events_saved,
            message=message,
        ),
        image_bytes,
    )
