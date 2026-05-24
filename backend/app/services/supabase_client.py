from functools import lru_cache

from supabase import Client, create_client

from app.config import Settings, get_settings


@lru_cache
def get_supabase_client() -> Client | None:
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_service_role_key:
        return None
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def require_supabase(settings: Settings | None = None) -> Client:
    settings = settings or get_settings()
    client = get_supabase_client()
    if client is None:
        raise RuntimeError(
            "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
        )
    return client
