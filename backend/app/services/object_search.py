import json
import re

import httpx

from app.config import get_settings
from app.models.schemas import AskResponse
from app.services import events_repository
from app.services.ask_synthesis import synthesize_ask_answer
from app.services.supabase_client import require_supabase

EXTRACT_PROMPT = """Extract the single object the user is looking for. Reply with JSON only:
{"object": "short noun phrase"}"""


def extract_object_from_question(question: str) -> str:
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


async def extract_object_query(question: str) -> str:
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
    try:
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
        obj = json.loads(content).get("object", "").strip()
        return obj or extract_object_from_question(question)
    except Exception:
        return extract_object_from_question(question)


async def find_object_location(question: str) -> AskResponse:
    client = require_supabase()
    object_query = await extract_object_query(question)

    events = events_repository.search_object_events(client, object_query, limit=15)
    if not events:
        tokens = events_repository.tokenize_object_query(object_query)
        if len(tokens) > 1:
            main_noun = max(tokens, key=len)
            events = events_repository.search_object_events(client, main_noun, limit=15)

    if not events:
        return AskResponse(
            object=object_query,
            message=f'No memory for "{object_query}". Scan while you move the object.',
        )

    return await synthesize_ask_answer(question, object_query, events)
