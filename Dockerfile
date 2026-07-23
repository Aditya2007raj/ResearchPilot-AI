# Use official Python slim image for lightweight container footprint
FROM python:3.11-slim

# Prevent Python from writing .pyc files and enable unbuffered output for clean logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Set working directory inside the container
WORKDIR /app

# Install system dependencies required for build/runtime operations
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency requirements first to leverage Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application source code from Backend/app into container /app/app
COPY Backend/app /app/app

# Create persistent storage directories inside container
RUN mkdir -p /app/uploads /app/chroma_db /app/temp

# Expose port (default 8000, customizable via PORT env var)
EXPOSE ${PORT}

# Docker Healthcheck instruction checking GET /health probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request, os; port = os.environ.get('PORT', '8000'); urllib.request.urlopen(f'http://localhost:{port}/health')" || exit 1

# Production CMD launching Uvicorn ASGI server without --reload
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
