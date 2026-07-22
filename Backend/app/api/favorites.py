from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from ..db.metadata_store import add_favorite, remove_favorite, get_user_favorites, get_paper_by_id_and_user
from ..security.dependencies import get_current_user, verify_paper_ownership

router = APIRouter()

@router.get("/favorites")
async def list_favorites(current_user: dict = Depends(get_current_user)):
    """Retrieve list of favorited papers for current user."""
    try:
        user_id = current_user["id"]
        favs = get_user_favorites(user_id=user_id)
        return {
            "success": True,
            "data": favs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch favorites: {str(e)}")

@router.post("/favorites/{paper_id}")
async def add_paper_favorite(
    paper_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Add a paper to current user's favorites."""
    await verify_paper_ownership(paper_id, current_user)
    user_id = current_user["id"]
    try:
        res = add_favorite(user_id=user_id, paper_id=paper_id)
        return {
            "success": True,
            "message": "Paper added to favorites",
            "data": res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add favorite: {str(e)}")

@router.delete("/favorites/{paper_id}")
async def remove_paper_favorite(
    paper_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Remove a paper from current user's favorites."""
    await verify_paper_ownership(paper_id, current_user)
    user_id = current_user["id"]
    try:
        remove_favorite(user_id=user_id, paper_id=paper_id)
        return {
            "success": True,
            "message": "Paper removed from favorites"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove favorite: {str(e)}")
