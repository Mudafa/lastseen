import uuid
from datetime import datetime, timezone

from supabase import Client

from app.config import Settings, get_settings

CONTENT_TYPE_EXT = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}


def upload_frame_image(
    client: Client,
    image_bytes: bytes,
    content_type: str | None = None,
    settings: Settings | None = None,
) -> str:
    settings = settings or get_settings()
    ext = CONTENT_TYPE_EXT.get(content_type or "image/jpeg", "jpg")
    date_prefix = datetime.now(timezone.utc).strftime("%Y/%m/%d")
    path = f"{date_prefix}/{uuid.uuid4()}.{ext}"

    bucket = client.storage.from_(settings.storage_bucket)
    bucket.upload(
        path,
        image_bytes,
        file_options={"content-type": content_type or "image/jpeg", "upsert": "false"},
    )
    return bucket.get_public_url(path)
