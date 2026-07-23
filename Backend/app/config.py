import logging
import json
from typing import List, Union
from pydantic_settings import BaseSettings

logger = logging.getLogger("researchpilot.config")


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # API
    api_prefix: str = "/api/v1"
    app_name: str = "ResearchPilot AI"
    app_version: str = "1.0.0"
    port: int = 8000

    # File Storage
    upload_dir: str = "uploads"
    temp_dir: str = "temp"

    # ChromaDB
    chroma_persist_dir: str = "chroma_db"
    collection_name: str = "research_papers"

    # Gemini API settings
    gemini_api_key: str = ""
    gemini_api_keys: str = ""
    gemini_model: str = "gemini-2.5-flash"

    # Security & Auth
    secret_key: str = "researchpilot_super_secret_jwt_key_2026_change_in_production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours

    # Production CORS
    cors_origins: Union[List[str], str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

    def get_cors_origins(self) -> List[str]:
        """Parse CORS origins string or list into a clean list of origins."""
        if isinstance(self.cors_origins, str):
            if not self.cors_origins.strip():
                return ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"]
            if self.cors_origins.strip().startswith("[") and self.cors_origins.strip().endswith("]"):
                try:
                    return json.loads(self.cors_origins)
                except Exception:
                    pass
            return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
        return self.cors_origins

    def validate_config(self) -> List[str]:
        """Validate critical production configuration settings."""
        warnings = []
        if self.secret_key == "researchpilot_super_secret_jwt_key_2026_change_in_production":
            warnings.append("SECRET_KEY is using default development key. Set a secure SECRET_KEY in production.")
        if not self.gemini_api_keys and not self.gemini_api_key:
            warnings.append("No Gemini API key specified (GEMINI_API_KEYS or GEMINI_API_KEY). Gemini features will fail.")
        if not self.gemini_model:
            warnings.append("GEMINI_MODEL is not set. Defaulting to gemini-2.5-flash.")
        if self.access_token_expire_minutes <= 0:
            warnings.append("ACCESS_TOKEN_EXPIRE_MINUTES must be positive.")
        return warnings


settings = Settings()

