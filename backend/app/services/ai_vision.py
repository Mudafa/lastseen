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


def is_ai_configured(settings: Settings | None = None) -> bool:
    settings = settings or get_settings()
    return bool(settings.openai_api_key or settings.gemini_api_key)


async def analyze_frame(image_bytes: bytes) -> VisionAnalysisResult:
    settings = get_settings()
    if settings.openai_api_key:
        return await _analyze_openai(image_bytes, settings)
    if settings.gemini_api_key:
        return await _analyze_gemini(image_bytes, settings)
    return VisionAnalysisResult(
        events=[],
        scene_summary="AI vision not configured.",
    )


async def _analyze_openai(image_bytes: bytes, settings: Settings) -> VisionAnalysisResult:
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
                        "image_url": {"url": f"data:image/jpeg;base64,{b64}"},
                    }
                ],
            },
        ],
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
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


async def _analyze_gemini(image_bytes: bytes, settings: Settings) -> VisionAnalysisResult:
    _ = settings
    _ = image_bytes
    return VisionAnalysisResult(
        events=[],
        scene_summary="Gemini vision not implemented yet. Use OPENAI_API_KEY for now.",
    )


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
