from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from datetime import datetime
import os
import math

from ..models.schemas import UploadResponse
from ..utils.file_utils import validate_file, save_upload_file_for_user
from ..config import settings
from ..services.pdf_processor import PDFProcessor
from ..db.vector_store import VectorStore
from ..db.metadata_store import add_paper
from ..security.dependencies import get_current_user

router = APIRouter()


@router.post("/upload/pdf", response_model=UploadResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload a PDF research paper bound to authenticated user."""
    user_id = current_user["id"]
    try:
        validate_file(file)
        
        # Save file in user's isolated upload directory
        file_id, file_path = save_upload_file_for_user(file, settings.upload_dir, user_id)
        
        # Extract text from PDF
        pdf_processor = PDFProcessor()
        extraction_result = pdf_processor.extract_text(file_path)
        full_text = extraction_result["full_text"]
        
        # Index document in user's isolated vector store collection
        vector_store = VectorStore()
        vector_store.add_document(user_id=user_id, file_id=file_id, text=full_text)
        
        clean_title = file.filename.replace(".pdf", "").replace("-", " ").replace("_", " ")
        clean_title = " ".join([w.capitalize() for w in clean_title.split()])
        
        page_count = extraction_result.get("page_count", 1)
        word_count = len(full_text.split())
        reading_time_minutes = math.ceil(word_count / 200)
        if reading_time_minutes == 0:
            reading_time_minutes = 1
        
        # Save metadata into SQLite store with user_id
        add_paper(
            paper_id=file_id,
            user_id=user_id,
            title=clean_title,
            authors="Extracted PDF Author",
            year="2026",
            file_path=file_path,
            health="Fully Analyzed",
            page_count=page_count,
            reading_time_minutes=reading_time_minutes
        )
        
        return UploadResponse(
            file_id=file_id,
            filename=file.filename,
            file_size=file.size,
            status="uploaded",
            uploaded_at=datetime.utcnow(),
            title=clean_title,
            authors="Extracted PDF Author",
            page_count=page_count,
            reading_time_minutes=reading_time_minutes
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
