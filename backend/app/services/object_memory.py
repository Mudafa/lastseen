from datetime import datetime

from app.models.schemas import ObjectEventRecord

VISIBLE_ACTIONS = frozenset({"placed", "moved", "stored"})
NOT_VISIBLE_ACTIONS = frozenset({"removed", "picked_up"})


def timeline_chronological(events: list[ObjectEventRecord]) -> list[ObjectEventRecord]:
    return sorted(events, key=lambda e: e.created_at)


def format_timeline_for_llm(events: list[ObjectEventRecord], limit: int = 8) -> str:
    """Oldest → newest for readable story (most recent `limit` events)."""
    ordered = timeline_chronological(events)
    if len(ordered) > limit:
        ordered = ordered[-limit:]
    lines = []
    for index, event in enumerate(ordered, start=1):
        time_str = event.created_at.strftime("%H:%M:%S")
        summary = f" — {event.scene_summary}" if event.scene_summary else ""
        lines.append(
            f'{index}. [{time_str}] action={event.action} location="{event.location}" '
            f"confidence={event.confidence:.0%}{summary}"
        )
    return "\n".join(lines) if lines else "No events."


def derive_object_memory(events: list[ObjectEventRecord]) -> dict:
    """
    events: newest first (as returned from search).
  """
    if not events:
        return {}

    newest = events[0]
    last_seen: ObjectEventRecord | None = None
    for event in events:
        if event.action in VISIBLE_ACTIONS:
            last_seen = event
            break

    if newest.action in NOT_VISIBLE_ACTIONS:
        visibility = "not_visible"
    elif newest.action in VISIBLE_ACTIONS:
        visibility = "likely_there"
    else:
        visibility = "unknown"

    return {
        "object_name": newest.object_name,
        "last_seen_location": last_seen.location if last_seen else None,
        "last_seen_at": last_seen.created_at if last_seen else None,
        "last_action": newest.action,
        "last_action_location": newest.location,
        "last_action_at": newest.created_at,
        "visibility": visibility,
        "image_url": (last_seen or newest).image_url,
        "confidence": (last_seen or newest).confidence,
    }
