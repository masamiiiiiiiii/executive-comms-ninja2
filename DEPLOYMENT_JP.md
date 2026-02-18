# Google Cloud Run デプロイガイド (バックエンド)

このガイドでは、バックエンド（Python/FastAPI）を Google Cloud Run にデプロイする手順をステップバイステップで説明します。
Cloud Run は、サーバーの管理をせずにコンテナを動かせるGoogleのサービスです。使った分だけ課金されるため、社内ツールのような断続的な利用に最適です。

---

## 前準備

1.  **Google Cloud アカウントの作成**: [Google Cloud Console](https://console.cloud.google.com/) にアクセスし、アカウントがない場合は作成してください。
2.  **プロジェクトの作成**:
    *   コンソール左上のプロジェクト選択から「新しいプロジェクト」を作成します。
    *   プロジェクトID（例: `executive-comms-12345`）をメモしてください。
3.  **課金の有効化**: Cloud Run を利用するには、プロジェクトに請求先アカウント（クレジットカード等）を紐付ける必要があります。

---

## 手順 1: Google Cloud SDK (gcloud CLI) のインストール

現在 `install.sh` を開かれているようですが、ターミナルで以下の手順を行ってください。

1.  インストールスクリプトを実行（まだ完了していない場合）:
    ```bash
    ./google-cloud-sdk/install.sh
    ```
2.  ターミナルを再起動するか、設定を読み込みます。
3.  インストール確認:
    ```bash
    gcloud --version
    ```
    バージョン情報が表示されればOKです。

---

## 手順 2: ログインとプロジェクト設定

ターミナルで以下のコマンドを順番に実行します。

1.  **Google アカウントにログイン**:
    ```bash
    gcloud auth login
    ```
    ブラウザが開くので、Google Cloud アカウントでログインして許可してください。

2.  **プロジェクトの設定**:
    `[YOUR_PROJECT_ID]` を先ほどメモしたプロジェクトIDに置き換えて実行します。
    ```bash
    gcloud config set project [YOUR_PROJECT_ID]
    ```

---

## 手順 3: 必要なAPIの有効化

Cloud Run とビルド機能を使うために、APIを有効化します。以下のコマンドをコピーして実行してください。

```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com
```

---

## 手順 4: デプロイ（本番）

いよいよバックエンドをクラウド上にアップロードします。
以下のコマンドの `[YOUR_...]` の部分をご自身の環境変数の値（`.env.local` にあるもの）に書き換えて実行してください。

**重要**: ターミナルで `backend` フォルダに移動してから実行してください。

```bash
cd backend
```

**実行するコマンド (1行で入力するか、バックスラッシュで行を繋げてください):**

```bash
gcloud run deploy executive-comms-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GCP_PROJECT_ID=[あなたのProjectID],GCP_BUCKET_NAME=[あなたのBucket名],SUPABASE_URL=[あなたのSupabaseURL],SUPABASE_SERVICE_ROLE_KEY=[あなたのSupabaseServiceRoleKey]"
```

*   **解説**:
    *   `--source .`: 現在のフォルダのコードをアップロードします。
    *   `--allow-unauthenticated`: 認証なしでアクセスできるようにします（社内共有用URLとして機能させるため。別途Basic認証等をかける場合は別設定が必要ですが、まずはこれで動かします）。
    *   `--set-env-vars`: 本番環境で使うための環境変数を設定します。

---

## 手順 5: 完了確認

コマンドが成功すると、最後に以下のようなURLが表示されます。

`Service [executive-comms-backend] has been deployed to [ https://executive-comms-backend-xxxxx-uc.a.run.app ]`

このURLが**あなたのバックエンドAPIのURL**です。
これをコピーして、フロントエンド（Vercelなど）の環境変数 `NEXT_PUBLIC_API_URL` に設定します。
（末尾に `/api` をつけるのを忘れずに！ 例: `https://...run.app/api`）
