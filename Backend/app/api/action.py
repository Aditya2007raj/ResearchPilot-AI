from fastapi import APIRouter, HTTPException
import os
from datetime import datetime

from ..services.pdf_processor import PDFProcessor
from ..services.action_generator import ActionGenerator
from ..config import settings

router = APIRouter()


@router.get("/analysis/{file_id}/action-plan")
async def get_action_plan(file_id: str):
    """
    Generate an action plan for an uploaded PDF.
    
    Args:
        file_id: UUID of the uploaded file
        
    Returns:
        Structured action plan with skills_to_learn, learning_path, project_ideas, estimated_timeline, recommended_resources
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
        
        # Generate action plan
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
