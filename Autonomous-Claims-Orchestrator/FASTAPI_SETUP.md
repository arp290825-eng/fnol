# FastAPI Server Setup

This document explains how to set up and use the FastAPI server for the Autonomous Claims Orchestrator.

## Overview

The FastAPI server (`backend/fastapi_server.py`) provides REST API endpoints that replace the previous Python subprocess approach. It's deployment-ready and uses environment variables for configuration.

## Installation

1. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

## Running the Server

### Development Mode
```bash
# From project root
python -m backend.fastapi_server
```

Or using uvicorn directly:
```bash
uvicorn backend.fastapi_server:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn backend.fastapi_server:app --host 0.0.0.0 --port 8000 --workers 4
```

## Environment Variables

The server uses the following environment variables (see `env.example` for details):

### API Configuration
- `API_HOST`: Server host (default: `0.0.0.0`)
- `API_PORT`: Server port (default: `8000`)
- `API_RELOAD`: Enable auto-reload in development (default: `false`)
- `CORS_ORIGINS`: Comma-separated list of allowed origins (default: `*`)

### Path Configuration (for deployment)
- `PROJECT_ROOT`: Absolute path to project root
- `DATA_DIR`: Absolute path to data directory
- `INGESTED_DIR`: Absolute path to ingested attachments directory
- `PROCESSED_CLAIMS_DIR`: Absolute path to processed claims directory
- `ENV_FILE`: Absolute path to .env file
- `LOCAL_DATA_DIR`: Absolute path to local data directory
- `POLICY_GROUNDING_MAPPING_FILE`: Absolute path to policy grounding mapping file
- `FAQ_CSV_FILE`: Absolute path to FAQ CSV file

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Claims Processing
- `POST /api/process-claim` - Process an ingested claim
  - Body: `{"ingestedClaimId": "ING-..."}`
  
### Ingested Claims
- `GET /api/ingested-claims?full=false` - Get list of ingested claims (summaries)
- `GET /api/ingested-claims?full=true` - Get full list of ingested claims
- `GET /api/ingested-claims/{claimId}` - Get a specific ingested claim by ID
- `POST /api/ingested-claims/clear` - Clear all ingested claims

### Processed Claims
- `GET /api/claims` - Get list of processed claim summaries
- `POST /api/claims` - Save a processed claim
- `GET /api/claims/{claimId}` - Get a processed claim by ID

### Dashboard
- `GET /api/dashboard/kpis` - Get dashboard KPIs and statistics

### Email Sync
- `POST /api/sync-inbox` - Sync email inbox and ingest new claims

## Connecting to Frontend

The frontend has been updated to automatically proxy requests to the FastAPI server through Next.js API routes. All API routes in `frontend/app/api/` now proxy to the FastAPI backend.

### Configuration

To configure the frontend to connect to your FastAPI server, create a `frontend/.env.local` file:

**For local development:**
```bash
# Create frontend/.env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Important Notes:**
- Use `localhost` (not `0.0.0.0`) as browsers cannot access `0.0.0.0`
- The FastAPI server binds to `0.0.0.0:8000` to accept connections from any interface
- But the frontend must use `localhost:8000` or `127.0.0.1:8000` to connect from the browser

**For production:**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

The frontend will default to `http://localhost:8000` if `NEXT_PUBLIC_API_URL` is not set.

### How It Works

The Next.js API routes act as a proxy layer:
- Frontend components call `/api/*` endpoints (same as before)
- Next.js API routes proxy these requests to the FastAPI server
- This maintains backward compatibility while using the new FastAPI backend

All API routes have been updated:
- `/api/process-claim` → Proxies to FastAPI `/api/process-claim`
- `/api/ingested-claims` → Proxies to FastAPI `/api/ingested-claims`
- `/api/ingested-claims/[id]` → Proxies to FastAPI `/api/ingested-claims/{id}`
- `/api/ingested-claims/clear` → Proxies to FastAPI `/api/ingested-claims/clear`
- `/api/claims` → Proxies to FastAPI `/api/claims` (GET and POST)
- `/api/claims/[claimId]` → Proxies to FastAPI `/api/claims/{claimId}`
- `/api/dashboard/kpis` → Proxies to FastAPI `/api/dashboard/kpis`
- `/api/sync-inbox` → Proxies to FastAPI `/api/sync-inbox`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Deployment

For production deployment:

1. Set all path environment variables to absolute paths
2. Set `CORS_ORIGINS` to your frontend domain(s)
3. Use a production WSGI server like Gunicorn with Uvicorn workers:
   ```bash
   gunicorn backend.fastapi_server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

4. Or use Docker with environment variables:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY . .
   RUN pip install -r backend/requirements.txt
   ENV PROJECT_ROOT=/app
   ENV DATA_DIR=/app/data
   CMD ["uvicorn", "backend.fastapi_server:app", "--host", "0.0.0.0", "--port", "8000"]
   ```
