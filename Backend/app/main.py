from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime
import os

from .config import settings

from .api import auth
from .api import upload
from .api import analysis
from .api import review
from .api import action
from .api import chat
from .api import papers
from .api import favorites
from .db.metadata_store import init_db

# Initialize metadata tables
init_db()

# Ensure uploads directory exists
os.makedirs(settings.upload_dir, exist_ok=True)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered Research Paper Assistant API"
)

# Mount static uploads directory for serving avatar images
app.mount("/static", StaticFiles(directory=settings.upload_dir), name="static")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    auth.router,
    prefix=settings.api_prefix,
    tags=["auth"]
)

app.include_router(
    favorites.router,
    prefix=settings.api_prefix,
    tags=["favorites"]
)

app.include_router(
    upload.router,
    prefix=settings.api_prefix,
    tags=["upload"]
)

app.include_router(
    analysis.router,
    prefix=settings.api_prefix,
    tags=["analysis"]
)

app.include_router(
    review.router,
    prefix=settings.api_prefix,
    tags=["review"]
)

app.include_router(
    action.router,
    prefix=settings.api_prefix,
    tags=["action"]
)

app.include_router(
    chat.router,
    prefix=settings.api_prefix,
    tags=["chat"]
)

app.include_router(
    papers.router,
    prefix=settings.api_prefix,
    tags=["papers"]
)

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "ResearchPilot AI API",
        "version": settings.app_version,
        "docs": "/docs"
    }


@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint."""
    return {
        "success": True,
        "data": {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": settings.app_version,
            "services": {
                "api": "operational"
            }
        }
    }
