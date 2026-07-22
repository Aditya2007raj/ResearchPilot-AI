import uuid
import os
from fastapi import HTTPException, UploadFile
from ..db.metadata_store import (
    create_user, get_user_by_email, get_user_by_id, 
    update_user_profile, update_user_avatar, update_user_password
)
from ..security.password import hash_password, verify_password
from ..security.jwt import create_access_token
from ..models.user import (
    UserRegisterRequest, UserLoginRequest, UserProfileUpdateRequest, 
    ChangePasswordRequest, UserResponse, TokenResponse
)
from ..config import settings

ALLOWED_AVATAR_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_AVATAR_SIZE = 5 * 1024 * 1024  # 5MB

class AuthService:
    """Service handling user registration, authentication, profile updates, and security."""
    
    @staticmethod
    def register_user(request: UserRegisterRequest) -> TokenResponse:
        email = request.email.lower().strip()
        
        existing_user = get_user_by_email(email)
        if existing_user:
            raise HTTPException(status_code=400, detail="An account with this email address already exists")
        
        if len(request.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
            
        user_id = str(uuid.uuid4())
        hashed_pwd = hash_password(request.password)
        
        user_data = create_user(
            user_id=user_id,
            full_name=request.full_name.strip(),
            email=email,
            password_hash=hashed_pwd
        )
        
        token = create_access_token(data={"sub": user_id, "email": email})
        
        user_response = UserResponse(
            id=user_data["id"],
            full_name=user_data["full_name"],
            email=user_data["email"],
            profile_picture=user_data.get("profile_picture"),
            bio=user_data.get("bio"),
            created_at=str(user_data["created_at"]),
            updated_at=str(user_data["updated_at"])
        )
        
        return TokenResponse(access_token=token, token_type="bearer", user=user_response)

    @staticmethod
    def login_user(request: UserLoginRequest) -> TokenResponse:
        email = request.email.lower().strip()
        user_data = get_user_by_email(email)
        
        if not user_data:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        if not verify_password(request.password, user_data["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        token = create_access_token(data={"sub": user_data["id"], "email": user_data["email"]})
        
        user_response = UserResponse(
            id=user_data["id"],
            full_name=user_data["full_name"],
            email=user_data["email"],
            profile_picture=user_data.get("profile_picture"),
            bio=user_data.get("bio"),
            created_at=str(user_data["created_at"]),
            updated_at=str(user_data["updated_at"])
        )
        
        return TokenResponse(access_token=token, token_type="bearer", user=user_response)

    @staticmethod
    def get_current_user_profile(user_id: str) -> UserResponse:
        user_data = get_user_by_id(user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="User profile not found")
            
        return UserResponse(
            id=user_data["id"],
            full_name=user_data["full_name"],
            email=user_data["email"],
            profile_picture=user_data.get("profile_picture"),
            bio=user_data.get("bio"),
            created_at=str(user_data["created_at"]),
            updated_at=str(user_data["updated_at"])
        )

    @staticmethod
    def update_profile(user_id: str, request: UserProfileUpdateRequest) -> UserResponse:
        user_data = update_user_profile(
            user_id=user_id,
            full_name=request.full_name.strip(),
            bio=request.bio.strip() if request.bio else None
        )
        return UserResponse(
            id=user_data["id"],
            full_name=user_data["full_name"],
            email=user_data["email"],
            profile_picture=user_data.get("profile_picture"),
            bio=user_data.get("bio"),
            created_at=str(user_data["created_at"]),
            updated_at=str(user_data["updated_at"])
        )

    @staticmethod
    def upload_avatar(user_id: str, file: UploadFile) -> UserResponse:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_AVATAR_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid image type. Allowed: JPG, JPEG, PNG, WEBP.")
            
        file.file.seek(0, 2)
        size = file.file.tell()
        file.file.seek(0)
        
        if size > MAX_AVATAR_SIZE:
            raise HTTPException(status_code=400, detail="Avatar image file size exceeds maximum limit of 5MB.")
            
        avatars_dir = os.path.join(settings.upload_dir, "avatars")
        os.makedirs(avatars_dir, exist_ok=True)
        
        filename = f"avatar_{user_id}{ext}"
        filepath = os.path.join(avatars_dir, filename)
        
        with open(filepath, "wb") as buffer:
            buffer.write(file.file.read())
            
        relative_url = f"/static/avatars/{filename}"
        user_data = update_user_avatar(user_id=user_id, profile_picture=relative_url)
        
        return UserResponse(
            id=user_data["id"],
            full_name=user_data["full_name"],
            email=user_data["email"],
            profile_picture=user_data.get("profile_picture"),
            bio=user_data.get("bio"),
            created_at=str(user_data["created_at"]),
            updated_at=str(user_data["updated_at"])
        )

    @staticmethod
    def delete_avatar(user_id: str) -> UserResponse:
        user_data = get_user_by_id(user_id)
        if user_data and user_data.get("profile_picture"):
            # Attempt file cleanup if exists
            pic_path = user_data["profile_picture"]
            if pic_path.startswith("/static/"):
                relative_path = pic_path.replace("/static/", "")
                full_path = os.path.join(settings.upload_dir, relative_path)
                if os.path.exists(full_path):
                    try:
                        os.remove(full_path)
                    except Exception:
                        pass
        
        updated_data = update_user_avatar(user_id=user_id, profile_picture=None)
        return UserResponse(
            id=updated_data["id"],
            full_name=updated_data["full_name"],
            email=updated_data["email"],
            profile_picture=None,
            bio=updated_data.get("bio"),
            created_at=str(updated_data["created_at"]),
            updated_at=str(updated_data["updated_at"])
        )

    @staticmethod
    def change_password(user_id: str, request: ChangePasswordRequest) -> dict:
        user_data = get_user_by_id(user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
            
        if not verify_password(request.current_password, user_data["password_hash"]):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
            
        if len(request.new_password) < 6:
            raise HTTPException(status_code=400, detail="New password must be at least 6 characters long")
            
        new_hash = hash_password(request.new_password)
        update_user_password(user_id=user_id, password_hash=new_hash)
        
        return {"success": True, "message": "Password successfully updated"}
