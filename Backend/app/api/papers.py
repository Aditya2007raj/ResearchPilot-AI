from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..db.metadata_store import get_all_papers, get_paper_stats

router = APIRouter()

@router.get("/papers")
async def list_papers():
    """Retrieve catalog list of all uploaded research papers."""
    try:
        papers = get_all_papers()
        return {
            "success": True,
            "data": papers
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch papers: {str(e)}")

@router.get("/papers/stats")
async def list_stats():
    """Retrieve aggregate research statistics."""
    try:
        stats = get_paper_stats()
        return {
            "success": True,
            "data": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")
