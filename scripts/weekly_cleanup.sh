#!/bin/bash

# プロジェクトのディレクトリパス
PROJECT_DIR="/Users/mkito/Desktop/Antigravity/executive-comms-ninja"

echo "[$(date)] 定期Markdownリファクタリングを実行します..."

# 1. アーカイブ用ディレクトリの作成
mkdir -p "$PROJECT_DIR/marketing_assets/archive"

# 2. ルール: marketing_assets直下にある特定の命名規則のファイルを archive に自動移動
# ※ "Draft" や "Threads"、"Post" といった名前が含まれるファイルを移動します。
# ※ VISUAL_BRAND_GUIDELINES などの重要なマスターファイルは移動されません。
find "$PROJECT_DIR/marketing_assets" -maxdepth 1 -type f \( -name "*Draft*.md" -o -name "*Threads*.md" -o -name "*Post*.md" \) -exec mv {} "$PROJECT_DIR/marketing_assets/archive/" \;

# 3. 追加で消したいキャッシュなどがあればここに記述（例: 自動バックアップの削除等）
# rm -rf "$PROJECT_DIR/.next/cache/*" 

echo "リファクタリング（アーカイブ処理）が完了しました。"
