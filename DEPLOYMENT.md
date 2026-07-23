# ResearchPilot AI — Production Deployment Guide

This document provides complete instructions for deploying the ResearchPilot AI platform to production cloud environments (Koyeb, Render, and Vercel).

---

## 1. Production Storage & Architecture Notice

> [!IMPORTANT]
> - **Current Storage Stack**: ResearchPilot AI currently uses SQLite (`metadata.db`), local ChromaDB (`chroma_db/`), and local directory storage (`uploads/`).
> - **Single-Instance Deployment**: These local persistent storage mechanisms are fully compatible with single-instance free-tier container deployments (e.g. Koyeb or Render with persistent volumes attached).
> - **Future Scalable Migration Path**: For multi-instance auto-scaling production deployments in future sprints, storage should be migrated to:
>   - **Database**: PostgreSQL (e.g. Neon, Supabase)
>   - **Vector Database**: Qdrant Cloud or PostgreSQL `pgvector`
>   - **File Storage**: Cloudinary, AWS S3, or Supabase Storage

---

## 2. Environment Variables

The backend accepts the following environment variables (see `.env.example`):

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `SECRET_KEY` | Yes | (dev fallback) | Strong random secret key for JWT token signing. |
| `ALGORITHM` | No | `HS256` | JWT signing algorithm. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `1440` | JWT token lifetime in minutes (1440 = 24 hours). |
| `GEMINI_API_KEYS` | Yes | `""` | Comma-separated list of Gemini API keys for rotation. |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Gemini model name used for analysis/chat. |
| `CORS_ORIGINS` | Yes | `http://localhost:5173...` | Comma-separated list of allowed frontend domains. |
| `PORT` | No | `8000` | HTTP port for Uvicorn server. |

---

## 3. Docker Commands

### Build Container Image
```bash
docker build -t researchpilot-backend .
```

### Run Container Locally
```bash
docker run -d -p 8000:8000 --env-file Backend/.env --name researchpilot-app researchpilot-backend
```

### Check Container Health & Logs
```bash
# Check container status (should show 'healthy')
docker ps

# View live logs
docker logs -f researchpilot-app

# Test Health Endpoint
curl http://localhost:8000/health

# Test Readiness Endpoint
curl http://localhost:8000/ready
```

---

## 4. Koyeb Deployment (Backend)

1. Sign in to [Koyeb Console](https://app.koyeb.com).
2. Click **Create Service** -> Select **GitHub** or **Docker**.
3. Point to your repository branch.
4. Set Dockerfile path: `./Dockerfile`.
5. Set Environment Variables (`SECRET_KEY`, `GEMINI_API_KEYS`, `CORS_ORIGINS`, etc.).
6. Set Port: `8000`.
7. Set Health Check Path: `/health`.
8. Click **Deploy**.

---

## 5. Render Deployment (Backend)

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set Runtime: **Docker**.
5. Set Environment Variables in Render Environment settings.
6. Set Health Check Path: `/health`.
7. Click **Create Web Service**.

---

## 6. Vercel Deployment (Frontend)

1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com).
3. Import `Frontend/` folder or select root repository and set Root Directory to `Frontend`.
4. Build settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_BASE_URL`: `https://<your-koyeb-or-render-app>.koyeb.app/api/v1`
6. Click **Deploy**.

---

## 7. Production Pre-Flight Checklist

- [x] Dockerfile uses multi-layer caching with `python:3.11-slim`.
- [x] `.dockerignore` excludes `.env`, `node_modules`, `uploads/`, `chroma_db/`, `metadata.db`.
- [x] Secret key updated from default fallback value.
- [x] Gemini API keys configured.
- [x] CORS origins set to production frontend domain(s).
- [x] `GET /health` returns 200 OK (`{"status":"ok", ...}`).
- [x] `GET /ready` returns 200 OK (`{"status":"ready", ...}`).
- [x] Frontend `npm run build` passes cleanly.
