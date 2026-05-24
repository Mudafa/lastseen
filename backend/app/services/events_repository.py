from supabase import Client

from app.models.schemas import FrameScanStatus, ObjectEventRecord, VisionAnalysisResult, VisionEvent


def insert_frame_scan(
    client: Client,
    *,
    status: FrameScanStatus,
    difference_score: float | None,
    image_url: str | None,
    events_saved: int,
    message: str,
) -> None:
    client.table("frame_scans").insert(
        {
            "status": status.value,
            "difference_score": difference_score,
            "image_url": image_url,
            "events_saved": events_saved,
            "message": message,
        }
    ).execute()


def insert_object_events(
    client: Client,
    analysis: VisionAnalysisResult,
    *,
    image_url: str | None,
    difference_score: float | None,
) -> int:
    if not analysis.events:
        return 0

    rows = [
        {
            "object_name": event.object_name,
            "action": _action_value(event),
            "location": event.location,
            "confidence": event.confidence,
            "image_url": image_url,
            "scene_summary": analysis.scene_summary,
            "evidence": event.evidence,
            "difference_score": difference_score,
        }
        for event in analysis.events
    ]
    client.table("object_events").insert(rows).execute()
    return len(rows)


def fetch_recent_events(client: Client, limit: int = 50) -> list[ObjectEventRecord]:
    response = (
        client.table("object_events")
        .select("id, object_name, action, location, confidence, image_url, scene_summary, created_at")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return [ObjectEventRecord.model_validate(row) for row in response.data or []]


def search_object_events(client: Client, object_query: str, limit: int = 5) -> ObjectEventRecord | None:
    pattern = f"%{object_query.strip().lower()}%"
    response = (
        client.table("object_events")
        .select("id, object_name, action, location, confidence, image_url, scene_summary, created_at")
        .ilike("object_name", pattern)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    rows = response.data or []
    if not rows:
        return None
    return ObjectEventRecord.model_validate(rows[0])


def _action_value(event: VisionEvent) -> str:
    action = event.action
    if hasattr(action, "value"):
        return action.value
    return str(action)
