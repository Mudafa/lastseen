import base64
import json
import re

import httpx

from app.config import Settings, get_settings
from app.models.schemas import VisionAnalysisResult, VisionEvent

COMPARE_PROMPT = """You compare TWO room photos: BEFORE (first image) and AFTER (second image).

Your job: detect ANY object that was placed, moved, removed, picked up, hidden, or stored between the images.
Be sensitive — even small moves matter (phone, keys, cup, book, remote, etc.).

{memory_context}

For each change, log:
- object_name: specific label (e.g. "red mug", not just "mug" if color visible)
- action: placed | moved | removed | picked_up | stored | unknown
- location: precise place in the room (e.g. "on the left side of the desk near the monitor")
- confidence: 0.0 to 1.0 (use decimals, NOT percentages)
- evidence: what changed between before and after

If an object disappeared in AFTER, still log it as moved/removed with last known location.

Return ONLY JSON:
{{
  "events": [ ... ],
  "scene_summary": "one sentence of what changed"
}}

If truly nothing changed, return {{"events": [], "scene_summary": "No change detected."}}"""

SINGLE_FRAME_PROMPT = """Analyze this room photo. List ANY objects that look recently placed, moved, or removed.

{memory_context}

Be specific about locations in the room. confidence must be 0.0–1.0 (decimals, not 90).

Return ONLY JSON:
{{
  "events": [
    {{
      "object_name": "string",
      "action": "placed | moved | removed | picked_up | stored | unknown",
      "location": "string",
      "confidence": 0.0,
      "evidence": "string"
    }}
  ],
  "scene_summary": "string"
}}"""


class VisionError(Exception):
    """Raised when the vision LLM call fails."""


def is_ai_configured(settings: Settings | None = None) -> bool:
    settings = settings or get_settings()
    return bool(settings.openai_api_key or settings.gemini_api_key)


def active_provider(settings: Settings | None = None) -> str | None:
    settings = settings or get_settings()
    if settings.ai_provider == "openai" and settings.openai_api_key:
        return "openai"
    if settings.ai_provider == "gemini" and settings.gemini_api_key:
        return "gemini"
    if settings.openai_api_key:
        return "openai"
    if settings.gemini_api_key:
        return "gemini"
    return None


async def analyze_frame(
    image_bytes: bytes,
    content_type: str | None = None,
    *,
    previous_image_bytes: bytes | None = None,
    memory_context: str = "",
) -> VisionAnalysisResult:
    settings = get_settings()
    provider = active_provider(settings)

    if provider is None:
        return VisionAnalysisResult(events=[], scene_summary="AI vision not configured.")

    context = memory_context or "No prior events."
    mime = _mime_type(image_bytes, content_type)

    try:
        if previous_image_bytes is not None:
            prev_mime = _mime_type(previous_image_bytes, content_type)
            prompt = COMPARE_PROMPT.format(memory_context=context)
            if provider == "openai":
                return await _openai_two_frame(
                    previous_image_bytes, prev_mime, image_bytes, mime, prompt, settings
                )
            return await _gemini_two_frame(
                previous_image_bytes, prev_mime, image_bytes, mime, prompt, settings
            )

        prompt = SINGLE_FRAME_PROMPT.format(memory_context=context)
        if provider == "openai":
            return await _openai_single(image_bytes, mime, prompt, settings)
        return await _gemini_single(image_bytes, mime, prompt, settings)
    except httpx.HTTPStatusError as exc:
        detail = exc.response.text[:300] if exc.response else str(exc)
        raise VisionError(f"Vision API error ({exc.response.status_code}): {detail}") from exc
    except httpx.RequestError as exc:
        raise VisionError(f"Vision API request failed: {exc}") from exc
    except (json.JSONDecodeError, KeyError, IndexError) as exc:
        raise VisionError(f"Could not parse vision model response: {exc}") from exc


async def _openai_single(image_bytes: bytes, mime: str, prompt: str, settings: Settings) -> VisionAnalysisResult:
    b64 = base64.standard_b64encode(image_bytes).decode("ascii")
    payload = {
        "model": settings.openai_vision_model,
        "response_format": {"type": "json_object"},
        "temperature": 0.1,
        "messages": [
            {"role": "system", "content": prompt},
            {
                "role": "user",
                "content": [{"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}"}}],
            },
        ],
    }
    content = await _openai_chat(payload, settings)
    return _parse_vision_content(content)


async def _openai_two_frame(
    prev_bytes: bytes,
    prev_mime: str,
    curr_bytes: bytes,
    curr_mime: str,
    prompt: str,
    settings: Settings,
) -> VisionAnalysisResult:
    prev_b64 = base64.standard_b64encode(prev_bytes).decode("ascii")
    curr_b64 = base64.standard_b64encode(curr_bytes).decode("ascii")
    payload = {
        "model": settings.openai_vision_model,
        "response_format": {"type": "json_object"},
        "temperature": 0.1,
        "messages": [
            {"role": "system", "content": prompt},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "BEFORE:"},
                    {"type": "image_url", "image_url": {"url": f"data:{prev_mime};base64,{prev_b64}"}},
                    {"type": "text", "text": "AFTER:"},
                    {"type": "image_url", "image_url": {"url": f"data:{curr_mime};base64,{curr_b64}"}},
                ],
            },
        ],
    }
    content = await _openai_chat(payload, settings)
    return _parse_vision_content(content)


async def _openai_chat(payload: dict, settings: Settings) -> str:
    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]


async def _gemini_single(image_bytes: bytes, mime: str, prompt: str, settings: Settings) -> VisionAnalysisResult:
    b64 = base64.standard_b64encode(image_bytes).decode("ascii")
    text = await _gemini_generate(
        [{"text": prompt}, {"inline_data": {"mime_type": mime, "data": b64}}], settings
    )
    return _parse_vision_content(text)


async def _gemini_two_frame(
    prev_bytes: bytes,
    prev_mime: str,
    curr_bytes: bytes,
    curr_mime: str,
    prompt: str,
    settings: Settings,
) -> VisionAnalysisResult:
    prev_b64 = base64.standard_b64encode(prev_bytes).decode("ascii")
    curr_b64 = base64.standard_b64encode(curr_bytes).decode("ascii")
    parts = [
        {"text": prompt},
        {"text": "BEFORE:"},
        {"inline_data": {"mime_type": prev_mime, "data": prev_b64}},
        {"text": "AFTER:"},
        {"inline_data": {"mime_type": curr_mime, "data": curr_b64}},
    ]
    text = await _gemini_generate(parts, settings)
    return _parse_vision_content(text)


async def _gemini_generate(parts: list[dict], settings: Settings) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_vision_model}:generateContent"
    payload = {
        "contents": [{"parts": parts}],
        "generationConfig": {"responseMimeType": "application/json", "temperature": 0.1},
    }
    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post(url, params={"key": settings.gemini_api_key}, json=payload)
        response.raise_for_status()
        body = response.json()
    response_parts = body["candidates"][0]["content"]["parts"]
    text = next((p["text"] for p in response_parts if "text" in p), "")
    if not text:
        raise VisionError("Gemini returned an empty response.")
    return text


def _mime_type(image_bytes: bytes, content_type: str | None) -> str:
    if content_type and content_type.startswith("image/"):
        return content_type
    if image_bytes[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if image_bytes[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    return "image/jpeg"


def _parse_vision_content(content: str) -> VisionAnalysisResult:
    text = content.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return parse_vision_json(json.loads(text))


def parse_vision_json(payload: dict) -> VisionAnalysisResult:
    raw = payload.get("events", [])
    if not isinstance(raw, list):
        raw = []
    events = [VisionEvent.model_validate(item) for item in raw]
    return VisionAnalysisResult(
        events=events,
        scene_summary=payload.get("scene_summary", ""),
    )
