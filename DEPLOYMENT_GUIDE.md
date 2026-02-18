# Production Deployment Guide (Cloud Run + Vercel)

This application uses a split frontend (Next.js) and backend (FastAPI) architecture. The recommended deployment strategy is:

1.  **Frontend**: Deploy to **Vercel** (Automatic builds from GitHub).
2.  **Backend**: Deploy to **Google Cloud Run** (Scalable container service, ideal for long-running python tasks).
3.  **Database**: Manage in **Supabase** (Already cloud-native).

---

## 🏗️ 1. Backend (Google Cloud Run)

### Why Cloud Run?
- **Serverless**: Scales to zero when not in use (Cost efficient).
- **Container Support**: Easily handles Python/FastAPI dependencies like `ffmpeg` (required for `yt-dlp`).
- **Integration**: Seamless with your existing Google Cloud Storage & Vertex AI.

### Steps:
1.  **Create `backend/Dockerfile`**:
    *(We will create this file for you automatically in the next step)*
    ```dockerfile
    FROM python:3.11-slim
    RUN apt-get update && apt-get install -y ffmpeg git && rm -rf /var/lib/apt/lists/*
    WORKDIR /app
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    COPY . .
    CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
    ```

2.  **Deploy Command**:
    Assuming you have `gcloud` CLI installed:
    ```bash
    # Set your project ID
    export PROJECT_ID="YOUR_GCP_PROJECT_ID"
    
    # Enable necessary APIs
    gcloud services enable run.googleapis.com artifactregistry.googleapis.com
    
    # Build & Deploy
    cd backend
    gcloud builds submit --tag gcr.io/$PROJECT_ID/executive-comms-backend
    gcloud run deploy executive-comms-backend \
      --image gcr.io/$PROJECT_ID/executive-comms-backend \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --set-env-vars GCP_PROJECT_ID=$PROJECT_ID,GCP_BUCKET_NAME=YOUR_BUCKET_NAME
    ```
    *Note: You will also need to add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as environment variables.*

3.  **Get Backend URL**:
    Run `gcloud run services describe executive-comms-backend --platform managed --region us-central1 --format "value(status.url)"`.
    (Example: `https://executive-comms-backend-xyz.a.run.app`)

---

## 🌐 2. Frontend (Vercel)

1.  **Push to GitHub**: ensure `frontend` and `backend` folders are in your repo.
2.  **Import to Vercel**:
    - Select your repository.
    - **Crucial**: Set "Root Directory" to `frontend`.
    - Accept default Next.js build settings.
3.  **Environment Variables**:
    Add the following in Vercel Dashboard -> Settings -> Environment Variables:
    - `NEXT_PUBLIC_API_URL`: The Backend URL from step 1 (e.g. `https://.../api`). Note: Add `/api` if your backend router is prefixed.
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL.
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
4.  **Deploy**: Click "Deploy".

---

## 🔒 3. Environment Variables Strategy
For security, manage your secrets carefully:

| Service | Environment Variables Required | Location |
| :--- | :--- | :--- |
| **Backend (Cloud Run)** | `GCP_PROJECT_ID`, `GCP_BUCKET_NAME`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_APPLICATION_CREDENTIALS` (Use Workload Identity ideally) | Cloud Run Console -> Edit & Deploy New Revision -> Variables |
| **Frontend (Vercel)** | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel Project Settings |

## 🚀 Next Steps for User Access
Once deployed:
1.  Share the **Vercel URL** with your team.
2.  (Optional) Add a custom domain (e.g., `app.executive-comms.ninja`) in Vercel settings.
3.  The backend will scale automatically based on usage.

---
**Does this look good? Would you like me to generate the `backend/Dockerfile` now?**
