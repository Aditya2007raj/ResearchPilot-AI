from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # API
    api_prefix: str = "/api/v1"
    app_name: str = "ResearchPilot AI"
    app_version: str = "0.1.0"

    # File Storage
    upload_dir: str = "uploads"

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

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
