import os
import uuid
from fastapi import UploadFile, HTTPException


ALLOWED_EXTENSIONS = {".pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def validate_file(file: UploadFile) -> None:
    """Validate file type and size."""
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF files are allowed."
        )
    
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File too large. Maximum size is 10MB."
        )
    
    if file_size == 0:
        raise HTTPException(
            status_code=400,
            detail="File is empty."
        )


def generate_file_id() -> str:
    """Generate a unique file ID."""
    return str(uuid.uuid4())


def get_user_upload_dir(base_dir: str, user_id: str) -> str:
    """Return and ensure directory path for user uploads: uploads/user_{user_id}."""
    user_dir = os.path.join(base_dir, f"user_{user_id}")
    os.makedirs(user_dir, exist_ok=True)
    return user_dir


def save_upload_file_for_user(upload_file: UploadFile, base_dir: str, user_id: str) -> tuple[str, str]:
    """
    Save uploaded file to user's isolated upload directory.
    Returns (file_id, file_path).
    """
    user_dir = get_user_upload_dir(base_dir, user_id)
    file_id = generate_file_id()
    file_extension = os.path.splitext(upload_file.filename)[1]
    filename = f"{file_id}{file_extension}"
    file_path = os.path.join(user_dir, filename)
    
    with open(file_path, "wb") as buffer:
        content = upload_file.file.read()
        buffer.write(content)
    
    return file_id, file_path
