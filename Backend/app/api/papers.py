from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from ..db.metadata_store import get_all_papers, get_paper_stats
from ..security.dependencies import get_current_user

router = APIRouter()

@router.get("/papers")
async def list_papers(current_user: dict = Depends(get_current_user)):
    """Retrieve catalog list of research papers owned by current user."""
    try:
        user_id = current_user["id"]
        papers = get_all_papers(user_id=user_id)
        return {
            "success": True,
            "data": papers
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch papers: {str(e)}")

@router.get("/papers/stats")
async def list_stats(current_user: dict = Depends(get_current_user)):
    """Retrieve aggregate research statistics for current user."""
    try:
        user_id = current_user["id"]
        stats = get_paper_stats(user_id=user_id)
        return {
            "success": True,
            "data": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")
