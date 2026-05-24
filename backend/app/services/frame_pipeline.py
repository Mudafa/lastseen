from app.config import Settings, get_settings
from app.models.schemas import FrameScanStatus, UploadFrameResponse
from app.services import ai_vision, events_repository, image_compare, storage
from app.services.ai_vision import VisionError
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

    if not ai_vision.is_ai_configured(settings):
        message = "Frame saved. Set OPENAI_API_KEY or GEMINI_API_KEY in backend/.env for AI detection."
        events_repository.insert_frame_scan(
            client,
            status=FrameScanStatus.PROCESSED,
            difference_score=difference_score,
            image_url=image_url,
            events_saved=0,
            message=message,
        )
        return (
            UploadFrameResponse(
                status=FrameScanStatus.PROCESSED,
                difference_score=difference_score,
                events_saved=0,
                message=message,
            ),
            image_bytes,
        )

    try:
        analysis = await ai_vision.analyze_frame(image_bytes, content_type)
    except VisionError as exc:
        message = f"AI analysis failed: {exc}"
        events_repository.insert_frame_scan(
            client,
            status=FrameScanStatus.ERROR,
            difference_score=difference_score,
            image_url=image_url,
            events_saved=0,
            message=message,
        )
        return (
            UploadFrameResponse(
                status=FrameScanStatus.ERROR,
                difference_score=difference_score,
                events_saved=0,
                message=message,
            ),
            image_bytes,
        )

    events_saved = events_repository.insert_object_events(
        client,
        analysis,
        image_url=image_url,
        difference_score=difference_score,
    )

    provider = ai_vision.active_provider(settings)
    if events_saved > 0:
        message = f"Frame analyzed ({provider}). Saved {events_saved} object event(s)."
    else:
        message = f"Frame analyzed ({provider}). {analysis.scene_summary}"

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
