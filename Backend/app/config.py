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

    # Gemini API (placeholder for future use)
    gemini_api_key: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
