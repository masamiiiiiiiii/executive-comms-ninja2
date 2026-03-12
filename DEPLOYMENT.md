# Google Cloud Run + Vercel Deployment Guide

このガイドは、本アプリケーション（Executive Comms Ninja）のバックエンド（Python/FastAPI）とフロントエンド（Next.js）のデプロイ手順を統合したものです。

## アーキテクチャ構成
1. **Frontend (Vercel)**: Next.jsアプリ。自動ビルド推奨。
2. **Backend (Google Cloud Run)**: FastAPIアプリ。`ffmpeg` 等のコンテナ依存や長時間処理（動画解析）に最適で、オートスケールダウン（$0）が可能。
3. **Database (Supabase)**: ユーザー＆データ管理。

---

## 🏗️ 1. Backend (Google Cloud Run) のデプロイ

### 必須環境変数
| 変数名 | 概要 | 取得方法 |
| :--- | :--- | :--- |
| `GCP_PROJECT_ID` | GCPプロジェクトID | Google Cloud Console |
| `GCP_BUCKET_NAME` | GCPストレージバケット名 | Cloud Storage |
| `SUPABASE_URL` | SupabaseのURL | Supabase > Project Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY`| Supabase管理者キー | 上記同画面 |

### デプロイ手順 (CLI)

1. `gcloud` CLIをインストールし、ログインとプロジェクト設定を行います。
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```
2. 必要なAPIを有効化します。
   ```bash
   gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com
   ```
3. `backend` フォルダに移動し、以下のデプロイコマンドを実行します（環境変数はご自身の値に書き換えてください）。
   ```bash
   cd backend
   gcloud run deploy executive-comms-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars "GCP_PROJECT_ID=XXX,GCP_BUCKET_NAME=XXX,SUPABASE_URL=XXX,SUPABASE_SERVICE_ROLE_KEY=XXX"
   ```
4. デプロイ成功後、ターミナルに表示される `https://executive-comms-backend-xxxxx-uc.a.run.app` のようなURLをメモしてください。これがAPIエンドポイントのベースURLです。

---

## 🌐 2. Frontend (Vercel) のデプロイ

1. GitHubにリポジトリをPushし、Vercelのダッシュボードから `Add New Project` でリポジトリを選択します。
2. **【重要】Root Directory を `frontend` に設定してください。**
3. 以下の **環境変数 (Environment Variables)** を設定します。

### Vercel必須環境変数
| 変数名 | 設定値 |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | バックエンドURL **+ `/api`** (例: `https://...run.app/api`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |

4. 「Deploy」をクリックして完了です。

---

## 🔒 セキュリティと共有 (社内向け)

本アプリを社内に共有する場合、Vercel側でBasic認証をかける（ProプランやMiddlewareの利用）、またはVercel Authenticationを利用して社外からのアクセスを遮断することを推奨します。Gemini APIによる動画解析にはトークン/秒ごとのコストが発生するため、不特定多数の利用にご注意ください。
