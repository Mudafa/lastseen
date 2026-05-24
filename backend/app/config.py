from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    supabase_url: str = ""
    supabase_service_role_key: str = ""

    openai_api_key: str = ""
    openai_vision_model: str = "gpt-4o-mini"
    gemini_api_key: str = ""
    gemini_vision_model: str = "gemini-2.5-flash"
    # openai | gemini | auto — which vision provider to use
    ai_provider: str = "openai"

    diff_ignore_below: float = 0.02
    diff_save_no_ai_below: float = 0.04

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
