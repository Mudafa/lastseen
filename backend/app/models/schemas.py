from datetime import datetime
from enum import Enum
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class ObjectAction(str, Enum):
    PLACED = "placed"
    MOVED = "moved"
    REMOVED = "removed"
    PICKED_UP = "picked_up"
    STORED = "stored"
    UNKNOWN = "unknown"


class FrameScanStatus(str, Enum):
    IGNORED = "ignored"
    SAVED_NO_AI = "saved_no_ai"
    PROCESSED = "processed"
    ERROR = "error"


class VisionEvent(BaseModel):
    object_name: str
    action: ObjectAction | Literal["unknown"] = ObjectAction.UNKNOWN
    location: str
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: str = ""

    @field_validator("confidence", mode="before")
    @classmethod
    def normalize_confidence(cls, value: object) -> float:
        if value is None:
            return 0.5
        score = float(value)
        if score > 1.0:
            score = score / 100.0
        return max(0.0, min(score, 1.0))


class VisionAnalysisResult(BaseModel):
    events: list[VisionEvent] = Field(default_factory=list)
    scene_summary: str = "No important object movement detected."


class UploadFrameResponse(BaseModel):
    status: FrameScanStatus
    difference_score: float | None = None
    events_saved: int = 0
    message: str


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, examples=["Where is my calculator?"])


class AskResponse(BaseModel):
    object: str
    location: str | None = None
    confidence: float | None = None
    scene_summary: str | None = None
    image_url: str | None = None
    message: str | None = None


class ObjectEventRecord(BaseModel):
    id: UUID
    object_name: str
    action: str
    location: str
    confidence: float
    image_url: str | None = None
    scene_summary: str | None = None
    created_at: datetime


class RecentEventsResponse(BaseModel):
    events: list[ObjectEventRecord] = Field(default_factory=list)
