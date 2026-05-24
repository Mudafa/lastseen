import json
import re

import httpx

from app.config import get_settings
from app.models.schemas import AskResponse, ObjectEventRecord
from app.services import events_repository
from app.services.supabase_client import require_supabase

EXTRACT_PROMPT = """Extract the single object the user is looking for. Reply with JSON only:
{"object": "short noun phrase"}

Examples:
- "Where is my calculator?" -> {"object": "calculator"}
- "Where did I put the blue hoodie?" -> {"object": "blue hoodie"}"""


def extract_object_from_question(question: str) -> str:
    """Pull a likely object name from a natural-language question (regex)."""
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


async def extract_object_with_llm(question: str) -> str:
    settings = get_settings()
    if not settings.openai_api_key:
        return extract_object_from_question(question)

    payload = {
        "model": settings.openai_vision_model,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": EXTRACT_PROMPT},
            {"role": "user", "content": question},
        ],
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]

    data = json.loads(content)
    obj = data.get("object", "").strip()
    return obj or extract_object_from_question(question)


async def find_object_location(question: str) -> AskResponse:
    client = require_supabase()
    settings = get_settings()

    if settings.openai_api_key:
        object_query = await extract_object_with_llm(question)
    else:
        object_query = extract_object_from_question(question)

    match = events_repository.search_object_events(client, object_query)

    if match is None:
        return AskResponse(
            object=object_query,
            message=f'No recent events found for "{object_query}". Try scanning with the camera first.',
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
