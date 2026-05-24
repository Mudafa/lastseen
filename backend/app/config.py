from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    supabase_url: str = ""
    supabase_service_role_key: str = ""

    openai_api_key: str = ""
    gemini_api_key: str = ""

    diff_ignore_below: float = 0.08
    diff_save_no_ai_below: float = 0.18

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "*"

    storage_bucket: str = "room-frames"
    uploads_dir: str = "tmp/uploads"

    @property
    def cors_origin_list(self) -> list[str]:
        if self.cors_origins.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
