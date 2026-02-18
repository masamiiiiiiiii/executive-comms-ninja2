# Deployment Guide for Executive Comms Ninja

This guide explains how to deploy the **Executive Comms Ninja** application for your internal team.

## Architecture
The app consists of two parts:
1.  **Frontend**: Next.js (React) app. Best hosted on **Vercel**.
2.  **Backend**: Python FastAPI app. Best hosted on **Google Cloud Run** or **Render**.
3.  **Database**: **Supabase** (PostgreSQL).

---

## 1. Prerequisites
-   A **GitHub** account (to host the code).
-   A **Supabase** project (you strictly need the URL and ANON_KEY/SERVICE_ROLE_KEY).
-   A **Google Cloud** project (for Vertex AI/Gemini API).

---

## 2. Deploying the Backend (API)

The backend handles video downloading and AI analysis. It requires a container environment.

### Option A: Google Cloud Run (Recommended)
1.  **Install Google Cloud CLI** (`gcloud`) if you haven't.
2.  **Authenticate**:
    ```bash
    gcloud auth login
    gcloud config set project YOUR_PROJECT_ID
    ```
3.  **Deploy**:
    Run this command from the `backend/` directory:
    ```bash
    gcloud run deploy executive-comms-backend \
      --source . \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --set-env-vars "GCP_PROJECT_ID=YOUR_PROJECT_ID,GCP_BUCKET_NAME=YOUR_BUCKET_NAME,SUPABASE_URL=YOUR_SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_KEY"
    ```
    *Note: Replace `YOUR_...` with your actual values.*

4.  **Copy the URL**: Cloud Run will give you a URL (e.g., `https://executive-comms-backend-xyz.a.run.app`). You need this for the frontend.

### Option B: Render.com
1.  Create a **Web Service** on Render.
2.  Connect your GitHub repo.
3.  Set **Root Directory** to `backend`.
4.  Set **Runtime** to `Docker`.
5.  Add **Environment Variables**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GCP_PROJECT_ID`, `GCP_BUCKET_NAME`.
    *   *Note: For Google Cloud Authentication on Render, you may need to provide the Service Account JSON key as a file or base64 env var.*

---

## 3. Deploying the Frontend (UI)

### Vercel (Recommended)
1.  Go to [Vercel.com](https://vercel.com) and "Add New Project".
2.  Import your GitHub repository.
3.  **Configure Project**:
    *   **Root Directory**: `frontend` (Important!)
    *   **Framework Preset**: Next.js
4.  **Environment Variables**:
    Add the following:
    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
    *   `NEXT_PUBLIC_API_URL`: The URL of your deployed Backend **PLUS `/api`**. 
        *   Example: `https://executive-comms-backend-xyz.a.run.app/api` 
        *   (Note: The backend routes are prefixed with `/api` in the code, so the frontend needs this to match).

5.  **Secure Internal Sharing (Optional)**:
    *   To password-protect your deployment (recommended for sharing), add these variables:
        *   `BASIC_AUTH_USER`: A username (e.g. `admin`)
        *   `BASIC_AUTH_PASSWORD`: A password (e.g. `secret123`)
    *   The app will automatically prompt for this login.

---

## 4. Security for Internal Sharing
Since this is for internal use:
1.  **Vercel Authentication**: Enable "Deployment Protection" (Vercel Authentication) in Settings > Deployment Protection. This requires a Vercel Pro plan or specific configuration.
2.  **Alternative**: Add a simple "Shared Password" to the frontend using Middleware (advanced).

## 5. Cost Warning
*   **Gemini API**: Analysis costs money per token/second of video.
*   **Cloud Run**: Costs for compute time while processing.
*   **Storage**: Storing video files (temporarily) costs small amounts.
