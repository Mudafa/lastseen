import json
from datetime import datetime

import httpx

from app.config import get_settings
from app.models.schemas import AskResponse, ObjectEventRecord
from app.services.object_memory import derive_object_memory, format_timeline_for_llm

ASK_SYNTHESIS_PROMPT = """You help users find objects in a room using ONLY the event timeline below.

Rules:
- Use ONLY facts from the timeline. Do not invent locations.
- "last_seen" = last event where the object was visibly placed/moved/stored with a clear location.
- "last_action" = the most recent event (may be removed = no longer visible).
- If the latest action is "removed" or visibility is not_visible, do NOT say the object IS STILL at last_seen.
  Say it was LAST SEEN there and may be hidden, moved away, or out of frame.
- answer_for_user: 2-4 clear sentences for a mobile app user.

Return ONLY JSON:
{
  "object": "string",
  "last_seen_location": "string or null",
  "last_seen_at": "ISO-8601 string or null",
  "last_action": "placed|moved|removed|picked_up|stored|unknown",
  "visibility": "likely_there|not_visible|unknown",
  "what_likely_happened": "one sentence",
  "answer_for_user": "full reply to show the user",
  "confidence": "high|medium|low"
}"""


def _confidence_to_float(label: str | None, fallback: float) -> float:
    mapping = {"high": 0.9, "medium": 0.65, "low": 0.35}
    if label and label.lower() in mapping:
        return mapping[label.lower()]
    return fallback


def _parse_iso(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _fallback_answer(question: str, memory: dict, events: list[ObjectEventRecord]) -> AskResponse:
    obj = memory.get("object_name") or "object"
    last_seen = memory.get("last_seen_location")
    last_action = memory.get("last_action")
    visibility = memory.get("visibility", "unknown")

    if visibility == "not_visible" and last_seen:
        answer = (
            f'Your {obj} is not visible in recent scans. It was last seen {last_seen}. '
            f'The latest action was "{last_action}" — it may have been hidden or taken away.'
        )
    elif last_seen:
        answer = (
            f'Your {obj} was last seen {last_seen}. '
            f'Latest action: {last_action}.'
        )
    else:
        answer = f'Found history for {obj} but no clear location. Latest action: {last_action}.'

    return AskResponse(
        object=obj,
        location=last_seen,
        confidence=memory.get("confidence"),
        scene_summary=answer,
        image_url=memory.get("image_url"),
        answer=answer,
        last_seen_location=last_seen,
        last_seen_at=memory.get("last_seen_at"),
        last_action=last_action,
        visibility=visibility,
        what_likely_happened=f"Latest recorded action: {last_action}.",
        timeline_event_count=len(events),
    )


async def synthesize_ask_answer(
    question: str,
    object_query: str,
    events: list[ObjectEventRecord],
) -> AskResponse:
    memory = derive_object_memory(events)
    settings = get_settings()

    if not settings.openai_api_key:
        return _fallback_answer(question, memory, events)

    timeline = format_timeline_for_llm(events, limit=8)
    memory_json = json.dumps(
        {
            k: (v.isoformat() if hasattr(v, "isoformat") else v)
            for k, v in memory.items()
            if k != "image_url"
        },
        default=str,
    )

    user_content = f"""User question: {question}
Search query: {object_query}

Derived facts (use as hints, timeline is source of truth):
{memory_json}

Event timeline (oldest to newest):
{timeline}
"""

    payload = {
        "model": settings.openai_vision_model,
        "response_format": {"type": "json_object"},
        "temperature": 0.2,
        "messages": [
            {"role": "system", "content": ASK_SYNTHESIS_PROMPT},
            {"role": "user", "content": user_content},
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
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
        last_seen_at = _parse_iso(data.get("last_seen_at")) or memory.get("last_seen_at")

        return AskResponse(
            object=data.get("object") or memory.get("object_name") or object_query,
            location=data.get("last_seen_location") or memory.get("last_seen_location"),
            confidence=_confidence_to_float(
                data.get("confidence"), memory.get("confidence") or 0.5
            ),
            scene_summary=data.get("what_likely_happened"),
            image_url=memory.get("image_url"),
            message=None,
            answer=data.get("answer_for_user") or data.get("answer") or "",
            last_seen_location=data.get("last_seen_location") or memory.get("last_seen_location"),
            last_seen_at=last_seen_at,
            last_action=data.get("last_action") or memory.get("last_action"),
            visibility=data.get("visibility") or memory.get("visibility"),
            what_likely_happened=data.get("what_likely_happened"),
            timeline_event_count=len(events),
        )
    except Exception:
        return _fallback_answer(question, memory, events)
