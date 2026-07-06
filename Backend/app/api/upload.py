from fastapi import APIRouter, UploadFile, File, HTTPException
from datetime import datetime
import os

from ..models.schemas import UploadResponse
from ..utils.file_utils import validate_file, save_upload_file
from ..config import settings

router = APIRouter()

# Ensure uploads directory exists
os.makedirs(settings.upload_dir, exist_ok=True)


@router.post("/upload/pdf", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """Upload a PDF research paper."""
    try:
        # Validate file
        validate_file(file)
        
        # Save file
        file_id = save_upload_file(file, settings.upload_dir)
        
        return UploadResponse(
            file_id=file_id,
            filename=file.filename,
            file_size=file.size,
            status="uploaded",
            uploaded_at=datetime.utcnow()
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
