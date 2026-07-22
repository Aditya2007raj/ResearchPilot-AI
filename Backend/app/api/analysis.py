from fastapi import APIRouter, HTTPException, Depends
import os
from datetime import datetime

from ..services.pdf_processor import PDFProcessor
from ..services.summarizer import Summarizer
from ..security.dependencies import get_current_user, verify_paper_ownership

router = APIRouter()


@router.get("/analysis/{file_id}/summary")
async def get_summary(
    file_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a structured summary for an uploaded PDF. Verify paper ownership first.
    """
    paper = await verify_paper_ownership(file_id, current_user)
    file_path = paper["file_path"]
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Paper file not found")
    
    try:
        pdf_processor = PDFProcessor()
        extraction_result = pdf_processor.extract_text(file_path)
        full_text = extraction_result["full_text"]
        
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
