from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from .config import settings
from .api import upload

from .api import analysis
from .api import review

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered Research Paper Assistant API"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix=settings.api_prefix, tags=["upload"])

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
