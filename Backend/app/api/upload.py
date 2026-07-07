from fastapi import APIRouter, UploadFile, File, HTTPException
from datetime import datetime
import os

from ..models.schemas import UploadResponse
from ..utils.file_utils import validate_file, save_upload_file
from ..config import settings
from ..services.pdf_processor import PDFProcessor
from ..db.vector_store import VectorStore

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
        
        # Locate the saved PDF file
        files = os.listdir(settings.upload_dir)
        matching_file = None
        for filename in files:
            if filename.startswith(file_id):
                matching_file = filename
                break
        
        if not matching_file:
            raise HTTPException(status_code=500, detail="Failed to locate saved file")
        
        file_path = os.path.join(settings.upload_dir, matching_file)
        
        # Extract text from PDF
        pdf_processor = PDFProcessor()
        extraction_result = pdf_processor.extract_text(file_path)
        full_text = extraction_result["full_text"]
        
        # Index document in vector store
        vector_store = VectorStore()
        vector_store.add_document(file_id=file_id, text=full_text)
        
        # Save metadata into SQLite store
        import math
        from ..db.metadata_store import add_paper
        
        clean_title = file.filename.replace(".pdf", "").replace("-", " ").replace("_", " ")
        clean_title = " ".join([w.capitalize() for w in clean_title.split()])
        
        page_count = extraction_result.get("page_count", 1)
        word_count = len(full_text.split())
        reading_time_minutes = math.ceil(word_count / 200)
        if reading_time_minutes == 0:
            reading_time_minutes = 1
        
        add_paper(
            paper_id=file_id,
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
