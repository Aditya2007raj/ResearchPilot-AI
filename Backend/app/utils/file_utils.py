import os
import uuid
from fastapi import UploadFile, HTTPException


ALLOWED_EXTENSIONS = {".pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def validate_file(file: UploadFile) -> None:
    """Validate file type and size."""
    # Check file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Only PDF files are allowed."
        )
    
    # Check file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Seek back to start
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is 10MB."
        )
    
    if file_size == 0:
        raise HTTPException(
            status_code=400,
            detail="File is empty."
        )


def generate_file_id() -> str:
    """Generate a unique file ID."""
    return str(uuid.uuid4())


def save_upload_file(upload_file: UploadFile, destination: str) -> str:
    """Save uploaded file to destination directory."""
    file_id = generate_file_id()
    file_extension = os.path.splitext(upload_file.filename)[1]
    filename = f"{file_id}{file_extension}"
    file_path = os.path.join(destination, filename)
    
    with open(file_path, "wb") as buffer:
        content = upload_file.file.read()
        buffer.write(content)
    
    return file_id
