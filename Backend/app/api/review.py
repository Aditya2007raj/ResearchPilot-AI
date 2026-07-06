from fastapi import APIRouter, HTTPException
import os
from datetime import datetime

from ..services.pdf_processor import PDFProcessor
from ..services.review_generator import ReviewGenerator
from ..config import settings

router = APIRouter()


@router.get("/analysis/{file_id}/review")
async def get_review(file_id: str):
    """
    Generate a structured review for an uploaded PDF.
    
    Args:
        file_id: UUID of the uploaded file
        
    Returns:
        Structured review with key_contributions, strengths, weaknesses, applications, research_gaps
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
        
        # Generate review
        review_generator = ReviewGenerator()
        review = review_generator.generate_review(full_text)
        
        return {
            "success": True,
            "data": {
                "file_id": file_id,
                "review": review,
                "generated_at": datetime.utcnow().isoformat()
            }
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Review generation failed: {str(e)}")
