# Stripe 日本円での価格設定手順

Executive Comms Ninjaに日本円（JPY）での決済オプションを追加するための設定手順です。

## 1. Stripeダッシュボードでの商品・価格の作成

Stripeアカウントにログインし、「商品カタログ (Product Catalog)」セクションに移動します。

### 「1回払い商品 (Tactical Deep Dive - JP)」の作成
1. **商品の追加** をクリック。
2. **名前**: `Tactical Deep Dive (JP)` 等、分かりやすい名前を入力。
3. **料金体系**: `標準料金`
4. **価格**: `5000`
5. **通貨**: `JPY (日本円)`
6. **請求期間**: `1回払い (One-time)`
7. 保存後、生成された **API ID (例: `price_1xyz...`)** をメモしてください。

### 「サブスクリプション商品 (Executive Pro - JP)」の作成
1. もう一度 **商品の追加** をクリック。
2. **名前**: `Executive Pro (JP)` 等を入力。
3. **料金体系**: `標準料金`
4. **価格**: `14800`
5. **通貨**: `JPY (日本円)`
6. **請求期間**: `継続 (Recurring) - 月次 (Monthly)`
7. 保存後、生成された **API ID (例: `price_1abc...`)** をメモしてください。

---

## 2. バックエンド環境変数の更新

Pythonバックエンド (`backend/`) に上記の2つの `price_id` を設定する必要があります。

`.env` またはシステムの環境変数に以下を追加してください。

```env
STRIPE_PRICE_ONETIME_JA=先ほどメモした1回払いのAPI_ID
STRIPE_PRICE_SUB_JA=先ほどメモした継続払いのAPI_ID
```

※現在、環境変数が設定されていない場合でも、安全装置としてダミーID (`price_dummy_onetime_ja` / `price_dummy_sub_ja`) が立ち上がりクラッシュしないようになっていますが、実際の決済を行うためには上記の設定が必須です。
