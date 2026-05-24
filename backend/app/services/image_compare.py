from io import BytesIO

from PIL import Image, ImageChops, ImageStat

from app.config import Settings, get_settings
from app.models.schemas import FrameScanStatus

# Larger thumbnail = more sensitive to small object moves in frame
COMPARE_SIZE = (64, 64)


def compute_difference_score(previous: bytes | None, current: bytes) -> float:
    """
    Resize both images to 64x64 grayscale and return a change score (0.0–1.0).
    Uses mean difference plus max channel diff for better small-move detection.
    """
    if previous is None:
        return 1.0

    prev = _to_grayscale(previous)
    curr = _to_grayscale(current)
    diff = ImageChops.difference(prev, curr)
    stat = ImageStat.Stat(diff)
    mean_diff = sum(stat.mean) / len(stat.mean)
    extrema = diff.getextrema()
    max_diff = extrema[1] if isinstance(extrema[0], int) else max(high for _, high in extrema)

    mean_score = mean_diff / 255.0
    max_score = max_diff / 255.0
    # Weight max higher so a small moved object still bumps the score
    score = (mean_score * 0.4) + (max_score * 0.6)
    return min(max(score, 0.0), 1.0)


def classify_frame(difference_score: float, settings: Settings | None = None) -> FrameScanStatus:
    settings = settings or get_settings()
    if difference_score < settings.diff_ignore_below:
        return FrameScanStatus.IGNORED
    if difference_score < settings.diff_save_no_ai_below:
        return FrameScanStatus.SAVED_NO_AI
    return FrameScanStatus.PROCESSED


def _to_grayscale(image_bytes: bytes) -> Image.Image:
    with Image.open(BytesIO(image_bytes)) as img:
        return img.convert("L").resize(COMPARE_SIZE, Image.Resampling.BILINEAR)
