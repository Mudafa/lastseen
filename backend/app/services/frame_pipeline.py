from app.config import Settings, get_settings
from app.models.schemas import FrameScanStatus, UploadFrameResponse
from app.services import ai_vision, events_repository, image_compare, storage
from app.services.ai_vision import VisionError
from app.services.supabase_client import require_supabase


async def _run_vision(
    client,
    settings: Settings,
    image_bytes: bytes,
    content_type: str | None,
    previous_frame: bytes | None,
    image_url: str,
    difference_score: float,
    scan_status: FrameScanStatus,
) -> UploadFrameResponse:
    recent = events_repository.fetch_recent_events_for_context(client, limit=10)
    memory_context = events_repository.format_events_context(recent)

    try:
        analysis = await ai_vision.analyze_frame(
            image_bytes,
            content_type,
            previous_image_bytes=previous_frame,
            memory_context=memory_context,
        )
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
        return UploadFrameResponse(
            status=FrameScanStatus.ERROR,
            difference_score=difference_score,
            events_saved=0,
            message=message,
        )

    events_saved = events_repository.insert_object_events(
        client,
        analysis,
        image_url=image_url,
        difference_score=difference_score,
    )

    provider = ai_vision.active_provider(settings)
    mode = "before+after" if previous_frame else "single"
    if events_saved > 0:
        message = f"Detected {events_saved} change(s) ({provider}, {mode})."
    else:
        message = f"No objects logged ({provider}). {analysis.scene_summary}"

    events_repository.insert_frame_scan(
        client,
        status=scan_status,
        difference_score=difference_score,
        image_url=image_url,
        events_saved=events_saved,
        message=message,
    )

    return UploadFrameResponse(
        status=scan_status,
        difference_score=difference_score,
        events_saved=events_saved,
        message=message,
    )


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
                message="Scene unchanged — skipped.",
            ),
            image_bytes,
        )

    image_url = storage.upload_frame_image(client, image_bytes, content_type, settings)

    if not ai_vision.is_ai_configured(settings):
        message = "Image saved. Add OPENAI_API_KEY to enable detection."
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

    # Run AI for both medium (saved_no_ai) and large changes when we can compare frames
    scan_status = (
        FrameScanStatus.PROCESSED
        if status == FrameScanStatus.PROCESSED
        else FrameScanStatus.SAVED_NO_AI
    )

    result = await _run_vision(
        client,
        settings,
        image_bytes,
        content_type,
        previous_frame,
        image_url,
        difference_score,
        scan_status,
    )
    return result, image_bytes
