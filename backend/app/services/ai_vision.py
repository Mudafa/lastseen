import base64
import json
import re

import httpx

from app.config import Settings, get_settings
from app.models.schemas import VisionAnalysisResult, VisionEvent

VISION_PROMPT = """Analyze this room image. Detect whether any objects appear to have been placed, moved, removed, picked up, or stored. Return only JSON in this format:

{
  "events": [
    {
      "object_name": "string",
      "action": "placed | moved | removed | picked_up | stored | unknown",
      "location": "string",
      "confidence": number,
      "evidence": "short explanation"
    }
  ],
  "scene_summary": "short description of what happened"
}

If nothing useful happened, return:
{
  "events": [],
  "scene_summary": "No important object movement detected."
}"""


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


async def analyze_frame(image_bytes: bytes, content_type: str | None = None) -> VisionAnalysisResult:
    settings = get_settings()
    provider = active_provider(settings)

    if provider is None:
        return VisionAnalysisResult(
            events=[],
            scene_summary="AI vision not configured.",
        )

    mime = _mime_type(image_bytes, content_type)

    try:
        if provider == "openai":
            return await _analyze_openai(image_bytes, mime, settings)
        return await _analyze_gemini(image_bytes, mime, settings)
    except httpx.HTTPStatusError as exc:
        detail = exc.response.text[:300] if exc.response else str(exc)
        raise VisionError(f"Vision API error ({exc.response.status_code}): {detail}") from exc
    except httpx.RequestError as exc:
        raise VisionError(f"Vision API request failed: {exc}") from exc
    except (json.JSONDecodeError, KeyError, IndexError) as exc:
        raise VisionError(f"Could not parse vision model response: {exc}") from exc


async def _analyze_openai(image_bytes: bytes, mime: str, settings: Settings) -> VisionAnalysisResult:
    b64 = base64.standard_b64encode(image_bytes).decode("ascii")
    payload = {
        "model": settings.openai_vision_model,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": VISION_PROMPT},
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime};base64,{b64}"},
                    }
                ],
            },
        ],
    }

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
        body = response.json()

    content = body["choices"][0]["message"]["content"]
    return _parse_vision_content(content)


async def _analyze_gemini(image_bytes: bytes, mime: str, settings: Settings) -> VisionAnalysisResult:
    b64 = base64.standard_b64encode(image_bytes).decode("ascii")
    model = settings.gemini_vision_model
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": VISION_PROMPT},
                    {"inline_data": {"mime_type": mime, "data": b64}},
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2,
        },
    }

    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post(
            url,
            params={"key": settings.gemini_api_key},
            json=payload,
        )
        response.raise_for_status()
        body = response.json()

    parts = body["candidates"][0]["content"]["parts"]
    text = next((p["text"] for p in parts if "text" in p), "")
    if not text:
        raise VisionError("Gemini returned an empty response.")
    return _parse_vision_content(text)


def _mime_type(image_bytes: bytes, content_type: str | None) -> str:
    if content_type and content_type.startswith("image/"):
        return content_type
    if image_bytes[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if image_bytes[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if image_bytes[:4] == b"RIFF" and image_bytes[8:12] == b"WEBP":
        return "image/webp"
    return "image/jpeg"


def _parse_vision_content(content: str) -> VisionAnalysisResult:
    text = content.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    payload = json.loads(text)
    return parse_vision_json(payload)


def parse_vision_json(payload: dict) -> VisionAnalysisResult:
    events = [VisionEvent.model_validate(item) for item in payload.get("events", [])]
    return VisionAnalysisResult(
        events=events,
        scene_summary=payload.get("scene_summary", ""),
    )
