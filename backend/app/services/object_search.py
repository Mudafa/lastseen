import re

from app.models.schemas import AskResponse, ObjectEventRecord


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
    """
    Search Supabase object_events for the best matching recent record.
    TODO: implement Supabase query.
    """
    _ = object_query
    return AskResponse(
        object=object_query,
        message="Object search not wired to Supabase yet.",
    )


def map_row_to_event(row: dict) -> ObjectEventRecord:
    return ObjectEventRecord.model_validate(row)
