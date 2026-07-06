from fastapi import APIRouter, HTTPException
import os
from datetime import datetime

from ..services.pdf_processor import PDFProcessor
from ..services.summarizer import Summarizer
from ..config import settings

router = APIRouter()


@router.get("/analysis/{file_id}/summary")
async def get_summary(file_id: str):
    """
    Generate a structured summary for an uploaded PDF.
    
    Args:
        file_id: UUID of the uploaded file
        
    Returns:
        Structured summary with problem, method, results, limitations, future_work
    """
    # Find the uploaded file
    files = os.listdir(settings.upload_dir)
    matching_file = None
    
    for filename in files:
        if filename.startswith(file_id):
            matching_file = filename
            break
    
    if not matching_file:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(settings.upload_dir, matching_file)
    
    try:
        # Extract text from PDF
        pdf_processor = PDFProcessor()
        extraction_result = pdf_processor.extract_text(file_path)
        full_text = extraction_result["full_text"]
        
        # Generate summary
        summarizer = Summarizer()
        summary = summarizer.generate_summary(full_text)
        
        return {
            "success": True,
            "data": {
                "file_id": file_id,
                "summary": summary,
                "page_count": extraction_result["page_count"],
                "generated_at": datetime.utcnow().isoformat()
            }
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
