import os
import time
import logging
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .db.metadata_store import init_db
from .db.chroma_client import ChromaClient
from .services.gemini_key_manager import GeminiKeyManager

from .api import (
    auth,
    upload,
    analysis,
    review,
    action,
    chat,
    papers,
    favorites,
)

# Configure structured application logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("researchpilot.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager for startup and shutdown routines.
    Ensures directory verification, DB initialization, and service warm-up.
    """
    logger.info("Initializing ResearchPilot AI backend startup sequence...")

    # 1. Environment & Config Validation
    config_warnings = settings.validate_config()
    for warning in config_warnings:
        logger.warning(f"[Startup Config Warning] {warning}")

    # 2. Filesystem Validation (Uploads, ChromaDB, Temp)
    required_dirs = [settings.upload_dir, settings.chroma_persist_dir, settings.temp_dir]
    for directory in required_dirs:
        try:
            os.makedirs(directory, exist_ok=True)
            logger.info(f"Verified directory: {directory}")
        except Exception as e:
            logger.error(f"Failed to create directory '{directory}': {e}")

    # 3. Metadata SQLite Database Initialization
    try:
        init_db()
        logger.info("Metadata SQLite database initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize metadata database: {e}")

    # 4. Chroma Vector Store Warm-up
    try:
        ChromaClient()
        logger.info("ChromaDB vector store client initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize ChromaDB client: {e}")

    # 5. Gemini Key Manager Warm-up
    try:
        key_mgr = GeminiKeyManager()
        logger.info(f"Gemini Key Manager loaded ({len(key_mgr.keys)} API key(s) configured).")
    except Exception as e:
        logger.error(f"Failed to load Gemini Key Manager: {e}")

    logger.info("ResearchPilot AI backend startup completed successfully.")

    yield

    logger.info("Shutting down ResearchPilot AI backend...")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered Research Paper Assistant API",
    lifespan=lifespan,
)

# Mount static uploads directory for serving avatar images safely
upload_full_path = os.path.abspath(settings.upload_dir)
os.makedirs(upload_full_path, exist_ok=True)
app.mount("/static", StaticFiles(directory=upload_full_path), name="static")

# Request Logging Middleware (Sanitized: NO credentials, keys, or tokens logged)
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000, 2)
    logger.info(f"HTTP {request.method} {request.url.path} -> Status: {response.status_code} ({duration_ms}ms)")
    return response

# Environment-Driven Production CORS Configuration
cors_origins = settings.get_cors_origins()
logger.info(f"Configuring CORS with origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers for Production Uniform JSON Error Responses
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail if isinstance(exc.detail, str) else "Request error",
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal server error occurred. Please try again later.",
        },
    )

# Include API routers
app.include_router(auth.router, prefix=settings.api_prefix, tags=["auth"])
app.include_router(favorites.router, prefix=settings.api_prefix, tags=["favorites"])
app.include_router(upload.router, prefix=settings.api_prefix, tags=["upload"])
app.include_router(analysis.router, prefix=settings.api_prefix, tags=["analysis"])
app.include_router(review.router, prefix=settings.api_prefix, tags=["review"])
app.include_router(action.router, prefix=settings.api_prefix, tags=["action"])
app.include_router(chat.router, prefix=settings.api_prefix, tags=["chat"])
app.include_router(papers.router, prefix=settings.api_prefix, tags=["papers"])


@app.get("/")
async def root():
    """Root API endpoint."""
    return {
        "message": "ResearchPilot AI API",
        "version": settings.app_version,
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """
    Production Liveness Probe.
    Returns lightweight health confirmation for container orchestration.
    """
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.app_version,
    }


@app.get("/ready")
async def readiness_check():
    """
    Production Readiness Probe.
    Verifies database connections, vector store, local storage, and service singletons.
    """
    checks = {
        "database": "ok",
        "vector_store": "ok",
        "directories": "ok",
        "gemini_manager": "ok",
    }
    is_ready = True

    # 1. Check directories
    for directory in [settings.upload_dir, settings.chroma_persist_dir, settings.temp_dir]:
        if not os.path.exists(directory):
            checks["directories"] = f"missing directory: {directory}"
            is_ready = False

    # 2. Check metadata DB initialization status
    try:
        from .db.metadata_store import get_db_connection
        conn = get_db_connection()
        conn.close()
    except Exception as e:
        checks["database"] = f"error: {str(e)}"
        is_ready = False

    # 3. Check Chroma vector store initialization status
    try:
        ChromaClient()
    except Exception as e:
        checks["vector_store"] = f"error: {str(e)}"
        is_ready = False

    # 4. Check Gemini key manager initialization
    try:
        mgr = GeminiKeyManager()
        if not mgr.keys:
            checks["gemini_manager"] = "warning: no api keys loaded"
    except Exception as e:
        checks["gemini_manager"] = f"error: {str(e)}"
        is_ready = False

    status_code = status.HTTP_200_OK if is_ready else status.HTTP_503_SERVICE_UNAVAILABLE
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "ready" if is_ready else "not_ready",
            "service": settings.app_name,
            "version": settings.app_version,
            "checks": checks,
        },
    )


@app.get("/api/v1/health")
async def legacy_health_check():
    """Detailed API health status."""
    return {
        "success": True,
        "data": {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": settings.app_version,
            "services": {
                "api": "operational",
            },
        },
    }
