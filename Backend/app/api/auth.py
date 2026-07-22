from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from ..models.user import (
    UserRegisterRequest, UserLoginRequest, UserProfileUpdateRequest, 
    ChangePasswordRequest, UserResponse, TokenResponse
)
from ..services.auth_service import AuthService
from ..security.dependencies import get_current_user

router = APIRouter()

@router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: UserRegisterRequest):
    """Register a new user account."""
    return AuthService.register_user(request)

@router.post("/auth/login", response_model=TokenResponse)
async def login(request: UserLoginRequest):
    """Authenticate user and issue JWT access token."""
    return AuthService.login_user(request)

@router.post("/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout current user session."""
    return {
        "success": True,
        "message": "Successfully logged out"
    }

@router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get authenticated user profile."""
    return AuthService.get_current_user_profile(current_user["id"])

@router.put("/auth/profile", response_model=UserResponse)
async def update_profile(
    request: UserProfileUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update user full name and bio."""
    return AuthService.update_profile(current_user["id"], request)

@router.put("/auth/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    """Change user password."""
    return AuthService.change_password(current_user["id"], request)

@router.post("/auth/avatar", response_model=UserResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload profile picture avatar."""
    return AuthService.upload_avatar(current_user["id"], file)

@router.delete("/auth/avatar", response_model=UserResponse)
async def delete_avatar(current_user: dict = Depends(get_current_user)):
    """Delete profile picture avatar."""
    return AuthService.delete_avatar(current_user["id"])
