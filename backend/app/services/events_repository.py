from supabase import Client

from app.models.schemas import FrameScanStatus, ObjectEventRecord, VisionAnalysisResult, VisionEvent

_LOCATION_ACTION_PRIORITY = {
    "placed": 4,
    "moved": 4,
    "stored": 4,
    "picked_up": 3,
    "unknown": 2,
    "removed": 1,
}


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


def fetch_recent_events_for_context(client: Client, limit: int = 10) -> list[ObjectEventRecord]:
    return fetch_recent_events(client, limit=limit)


def format_events_context(events: list[ObjectEventRecord]) -> str:
    if not events:
        return "No prior object events yet."
    lines = []
    for event in reversed(events):
        lines.append(
            f"- {event.object_name}: {event.action} at {event.location} "
            f"({event.confidence:.0%})"
        )
    return "Recent memory from this room:\n" + "\n".join(lines)


_SEARCH_STOP_WORDS = frozenset(
    {
        "a",
        "an",
        "the",
        "my",
        "your",
        "is",
        "are",
        "was",
        "where",
        "did",
        "i",
        "put",
        "leave",
        "find",
        "last",
        "see",
        "seen",
    }
)

_SELECT = (
    "id, object_name, action, location, confidence, image_url, scene_summary, created_at"
)


def tokenize_object_query(object_query: str) -> list[str]:
    """Split query into words; drop filler so 'red controller' matches 'red playstation controller'."""
    words = [w.lower() for w in object_query.replace("?", "").split() if w.strip()]
    tokens = [w for w in words if w not in _SEARCH_STOP_WORDS and len(w) > 1]
    return tokens or words


def _score_event_match(event: ObjectEventRecord, tokens: list[str], phrase: str) -> tuple[int, int, float]:
    name = event.object_name.lower()
    blob = f"{name} {event.scene_summary or ''} {event.location or ''}".lower()

    if phrase and phrase in blob:
        return (4, len(tokens), event.confidence)

    if not tokens:
        return (0, 0, 0.0)

    if all(token in blob for token in tokens):
        name_hits = sum(1 for token in tokens if token in name)
        return (3, name_hits, event.confidence)

    # Partial: main noun (longest token) must match — e.g. "controller" from "red controller"
    main = max(tokens, key=len)
    if main in name:
        other_hits = sum(1 for token in tokens if token != main and token in blob)
        return (2, other_hits + 1, event.confidence)

    return (0, 0, 0.0)


def search_object_events(client: Client, object_query: str, limit: int = 20) -> list[ObjectEventRecord]:
    phrase = object_query.strip().lower()
    tokens = tokenize_object_query(object_query)
    search_terms = list(dict.fromkeys(tokens + ([phrase] if phrase else [])))

    seen: dict[str, ObjectEventRecord] = {}
    for term in search_terms:
        pattern = f"%{term}%"
        for column in ("object_name", "scene_summary", "location"):
            response = (
                client.table("object_events")
                .select(_SELECT)
                .ilike(column, pattern)
                .order("created_at", desc=True)
                .limit(40)
                .execute()
            )
            for row in response.data or []:
                row_id = str(row["id"])
                if row_id not in seen:
                    seen[row_id] = ObjectEventRecord.model_validate(row)

    ranked = sorted(
        seen.values(),
        key=lambda event: (
            _score_event_match(event, tokens, phrase),
            event.created_at.timestamp(),
        ),
        reverse=True,
    )

    # Only return events with some relevance
    relevant = [event for event in ranked if _score_event_match(event, tokens, phrase)[0] > 0]
    return relevant[:limit]


def pick_best_location_event(events: list[ObjectEventRecord]) -> ObjectEventRecord | None:
    if not events:
        return None

    def score(event: ObjectEventRecord) -> tuple[int, float]:
        priority = _LOCATION_ACTION_PRIORITY.get(event.action, 0)
        return (priority, event.confidence)

    ranked = sorted(events, key=score, reverse=True)
    newest = events[0]
    if newest.action == "removed":
        for candidate in events:
            if candidate.action in ("placed", "moved", "stored") and candidate.location:
                return candidate
    return ranked[0]


def _action_value(event: VisionEvent) -> str:
    action = event.action
    if hasattr(action, "value"):
        return action.value
    return str(action)
