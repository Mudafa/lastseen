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


async def analyze_frame(image_bytes: bytes) -> VisionAnalysisResult:
    """
    Send frame to an AI vision model and return structured events.
    TODO: wire OpenAI / Gemini vision API.
    """
    _ = image_bytes
    return VisionAnalysisResult(
        events=[],
        scene_summary="AI vision not configured yet.",
    )


def parse_vision_json(payload: dict) -> VisionAnalysisResult:
    events = [VisionEvent.model_validate(item) for item in payload.get("events", [])]
    return VisionAnalysisResult(
        events=events,
        scene_summary=payload.get("scene_summary", ""),
    )
