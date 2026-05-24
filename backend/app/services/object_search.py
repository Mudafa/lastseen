import re

from app.models.schemas import AskResponse, ObjectEventRecord
from app.services import events_repository
from app.services.supabase_client import require_supabase


def extract_object_from_question(question: str) -> str:
    """Pull a likely object name from a natural-language question."""
    cleaned = question.strip().lower()
    patterns = [
        r"where(?:\s+is|\s+did\s+i\s+put|\s+did\s+i\s+leave|\s+are)\s+(?:my|the|a|an)?\s*(.+?)\??$",
        r"find\s+(?:my|the|a|an)?\s*(.+?)\??$",
        r"(.+?)\??$",
    ]
    for pattern in patterns:
        match = re.search(pattern, cleaned)
        if match:
            return match.group(1).strip()
    return cleaned


async def find_object_location(object_query: str) -> AskResponse:
    client = require_supabase()
    match = events_repository.search_object_events(client, object_query)

    if match is None:
        return AskResponse(
            object=object_query,
            message=f"No recent events found for “{object_query}”.",
        )

    return AskResponse(
        object=match.object_name,
        location=match.location,
        confidence=match.confidence,
        scene_summary=match.scene_summary,
        image_url=match.image_url,
    )


def map_row_to_event(row: dict) -> ObjectEventRecord:
    return ObjectEventRecord.model_validate(row)
