# ORCX Website Cloudflare Pages 段階的移行計画

## 現状構成の整理

### さくらサーバー（継続利用）

- スタンダードプラン継続
- メールサーバーとして利用
- DNS の一部機能を継続利用

### Web サイト移行対象

- 静的サイトのホスティング
- お問い合わせフォーム（GAS 連携）
- アセット配信

## 1. 事前準備（1 日）

### 移行対象の分離確認

```plaintext
1. メール関連（さくらサーバーに残すもの）
   - メールサーバー設定
   - MXレコード
   - SPF/DKIMレコード

2. Web関連（Cloudflareに移行するもの）
   - Webサイトコンテンツ
   - SSLサーバー証明書
   - Aレコード（www用）
```

### Cloudflare 設定

1. 無料プランでアカウント作成
2. プロジェクト作成（制限確認）
   - 帯域制限: 無制限
   - デプロイ回数: 500 回/月
   - 同時ビルド数: 1
   - ビルド時間: 最大 20 分

## 2. DNS 設定準備（1 日）

### さくらサーバーでの設定維持

```plaintext
# 維持するDNSレコード
Type   Name   Value                TTL
MX     @      mail.orcx.co.jp     3600
TXT    @      v=spf1...           3600
```

### Cloudflare での設定準備

```plaintext
# 追加するDNSレコード
Type   Name   Target             TTL
CNAME  www    pages.dev          Auto

# SSL設定
- SSL/TLS: Flexible
- Always Use HTTPS: ON
```

## 3. デプロイ設定（1 日）

### ビルド設定の更新

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && npx wrangler pages deploy dist"
  }
}
```

### 環境変数の設定

Cloudflare Pages 管理画面で設定：

```env
# Production variables
VITE_GOOGLE_MAPS_API_KEY=[現在の値]
VITE_GAS_ENDPOINT=[現在の値]

# Preview variables（開発用）
VITE_GOOGLE_MAPS_API_KEY=[開発用の値]
VITE_GAS_ENDPOINT=[開発用の値]
```

## 4. テストデプロイ（1 日）

### テスト手順

1. プレビューデプロイの実行

```bash
npm run build
npx wrangler pages dev ./dist
```

2. 動作確認項目

- [ ] ページ表示
- [ ] Google Maps 表示
- [ ] お問い合わせフォーム
- [ ] レスポンシブ対応
- [ ] アセット読み込み

## 5. 部分的移行（1-2 日）

### 段階 1: www サブドメインの移行

1. www の CNAME レコードを Cloudflare に向ける
2. TTL を 1 時間に設定
3. 動作確認
   - SSL 接続
   - ページロード
   - フォーム動作

### 段階 2: パフォーマンス最適化

```plaintext
# Pages設定
- Auto Minify: 有効化
- HTTPS Redirect: 有効化
- Caching: aggressive
```

## 6. 監視設定（1 日）

### Cloudflare Analytics（無料）

- ページビュー監視
- エラーレート監視
- パフォーマンス計測

### アラート設定

```javascript
// GASでの監視（既存コードに追加）
function checkWebsiteStatus() {
  const response = UrlFetchApp.fetch("https://www.orcx.co.jp");
  if (response.getResponseCode() !== 200) {
    notifyError("Website is down");
  }
}
```

## 無料プランでの制限事項

### Cloudflare Pages 制限

- ビルド時間: 最大 20 分
- 同時ビルド数: 1
- デプロイ回数: 500 回/月

### 最適化のポイント

1. ビルド時間の短縮
   - 不要なアセットの削除
   - ビルドキャッシュの活用
2. デプロイ回数の管理
   - テストデプロイの制限
   - 本番デプロイの計画的実行

## ロールバック手順

### 即時ロールバック

1. www の CNAME レコードをさくらサーバーに戻す
2. TTL を元の値に戻す
3. Cloudflare のプロジェクトを一時停止

### 段階的ロールバック

1. トラフィックの監視
2. DNS 伝播の確認
3. SSL 証明書の再確認

## 注意点

1. メールサービスには一切影響を与えない
2. さくらサーバーの設定は維持
3. 無料プランの制限を常に意識
4. バックアップの定期取得

## 将来の検討事項

1. Pro プランへの移行基準
   - 月間 PV 10k 超過時
   - ビルド時間が 20 分を超過時
   - カスタムドメインが 5 個以上必要時
2. パフォーマンス改善の余地
3. セキュリティ強化オプション
