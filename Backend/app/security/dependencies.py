from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Dict, Any
from .jwt import decode_access_token
from ..db.metadata_store import get_user_by_id, get_paper_by_id_and_user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """
    FastAPI dependency to extract and authenticate the current user from JWT Bearer token.
    Raises HTTP 401 Unauthorized if token is missing, invalid, or expired.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
        
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
        
    user = get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
        
    return user

async def verify_paper_ownership(file_id: str, current_user: Dict[str, Any]) -> Dict[str, Any]:
    """
    Verifies that the target paper exists and is owned by the current user.
    If unauthorized or not found, returns 403 Forbidden without leaking existence.
    """
    user_id = current_user["id"]
    paper = get_paper_by_id_and_user(paper_id=file_id, user_id=user_id)
    
    if not paper:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not have permission to access this research paper workspace."
        )
    return paper
