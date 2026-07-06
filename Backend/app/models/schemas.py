from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UploadResponse(BaseModel):
    """Response model for file upload."""
    file_id: str
    filename: str
    file_size: int
    status: str
    uploaded_at: datetime


class ErrorResponse(BaseModel):
    """Error response model."""
    success: bool = False
    error: str
    detail: Optional[str] = None
