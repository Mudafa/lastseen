from io import BytesIO

from PIL import Image, ImageChops, ImageStat

from app.config import Settings, get_settings
from app.models.schemas import FrameScanStatus


def compute_difference_score(previous: bytes | None, current: bytes) -> float:
    """
    Resize both images to 32x32 grayscale and return mean pixel difference (0.0–1.0).
    If there is no previous frame, treat as maximum change.
    """
    if previous is None:
        return 1.0

    prev = _to_grayscale_32(previous)
    curr = _to_grayscale_32(current)
    diff = ImageChops.difference(prev, curr)
    stat = ImageStat.Stat(diff)
    # Mean of RGB channels on grayscale diff image
    mean_diff = sum(stat.mean) / len(stat.mean)
    return min(max(mean_diff / 255.0, 0.0), 1.0)


def classify_frame(difference_score: float, settings: Settings | None = None) -> FrameScanStatus:
    settings = settings or get_settings()
    if difference_score < settings.diff_ignore_below:
        return FrameScanStatus.IGNORED
    if difference_score < settings.diff_save_no_ai_below:
        return FrameScanStatus.SAVED_NO_AI
    return FrameScanStatus.PROCESSED


def _to_grayscale_32(image_bytes: bytes) -> Image.Image:
    with Image.open(BytesIO(image_bytes)) as img:
        return img.convert("L").resize((32, 32), Image.Resampling.BILINEAR)
