from fastapi import APIRouter, HTTPException, Depends
import os
from datetime import datetime

from ..services.pdf_processor import PDFProcessor
from ..services.action_generator import ActionGenerator
from ..security.dependencies import get_current_user, verify_paper_ownership

router = APIRouter()


@router.get("/analysis/{file_id}/action-plan")
async def get_action_plan(
    file_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate an action plan for an uploaded PDF. Verify paper ownership first.
    """
    paper = await verify_paper_ownership(file_id, current_user)
    file_path = paper["file_path"]
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Paper file not found")
    
    try:
        pdf_processor = PDFProcessor()
        extraction_result = pdf_processor.extract_text(file_path)
        full_text = extraction_result["full_text"]
        
        action_generator = ActionGenerator()
        action_plan = action_generator.generate_action_plan(full_text)
        
        return {
            "success": True,
            "data": {
                "file_id": file_id,
                "action_plan": action_plan,
                "generated_at": datetime.utcnow().isoformat()
            }
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Action plan generation failed: {str(e)}")
