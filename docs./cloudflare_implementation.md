# ORCX Website Cloudflare Pages 実装手順書

## 目次

1. [事前準備](#1-事前準備)
2. [開発環境のセットアップ](#2-開発環境のセットアップ)
3. [ビルド設定の最適化](#3-ビルド設定の最適化)
4. [環境変数の設定](#4-環境変数の設定)
5. [アセットの最適化](#5-アセットの最適化)
6. [パフォーマンス最適化](#6-パフォーマンス最適化)
7. [デプロイ手順](#7-デプロイ手順)
8. [監視設定](#8-監視設定)
9. [ロールバック手順](#9-ロールバック手順)
10. [注意事項](#10-注意事項)

## 1. 事前準備

### 1.1. 現在の実装の確認

```plaintext
現在のプロジェクト構造:
.
├── src/               # ソースコード
│   ├── assets/       # 画像、SVGなどのアセット
│   ├── components/   # Reactコンポーネント
│   ├── constants/    # 定数定義
│   ├── hoc/          # 高階コンポーネント
│   ├── styles/       # スタイル定義
│   └── utils/        # ユーティリティ関数
├── public/           # 静的ファイル
├── docs/            # 現在のビルド出力（GitHub Pages用 - 移行後は不要）
└── assets/          # その他のアセット
```

### 1.2. 必要なアカウントの作成

1. Cloudflare アカウントの作成

   ```bash
   # アカウント作成後、以下の情報を保存
   CLOUDFLARE_ACCOUNT_ID=<your_account_id>
   CLOUDFLARE_API_TOKEN=<your_api_token>
   ```

2. プロジェクトの作成
   - プロジェクト名: `orcx-website`
   - フレームワーク: Vite
   - ビルドコマンド: `npm run build`
   - ビルド出力ディレクトリ: `dist` (現在の`docs`から変更)

### 1.3. DNS 設定の準備

1. さくらサーバーでの維持設定

   ```plaintext
   # 維持するDNSレコード
   Type   Name   Value                TTL
   MX     @      mail.orcx.co.jp     3600
   TXT    @      v=spf1...           3600
   ```

2. Cloudflare での初期設定
   ```plaintext
   # 追加するDNSレコード
   Type   Name   Target             TTL
   CNAME  www    pages.dev          Auto
   ```

### 1.4. GitHub Pages からの移行準備

1. 現在のデプロイ状態の確認

   ```bash
   # 現在のGitHub Pagesの設定を確認
   git config --get remote.origin.url
   ```

2. 移行手順

   ```bash
   # 1. 最後のGitHub Pagesデプロイをバックアップ
   cp -r docs/ github-pages-backup/

   # 2. GitHub Pagesの設定を無効化
   # - GitHubリポジトリの"Settings" > "Pages"で
   # - "Build and deployment"の"Source"を"None"に設定

   # 3. docsディレクトリをgitignoreに追加
   echo "docs/" >> .gitignore

   # 4. package.jsonからGitHub Pages関連のスクリプトを削除
   # 以下のような行を削除:
   # "deploy": "gh-pages -d docs"
   ```

3. DNS 移行の準備

   ```plaintext
   # 現在のDNS設定をバックアップ
   現在のGitHub Pages CNAME: <current_github_pages_cname>
   TTL: <current_ttl>

   # 新しいCloudflare DNS設定
   Type   Name   Target             TTL
   CNAME  www    pages.dev          Auto
   ```

4. 移行タイムライン
   ```plaintext
   1. Cloudflareでの新環境構築と動作確認
   2. DNS切り替え準備（TTLを短縮）
   3. 本番切り替え
   4. GitHub Pages設定の無効化
   ```

## 2. 開発環境のセットアップ

### 2.1. リポジトリのクローンと初期設定

```bash
# リポジトリをクローン
git clone https://github.com/kiku-hub/kiku-hub.github.io.git
cd kiku-hub.github.io

# 不要なディレクトリの削除
rm -rf .next/ biped/ orca/

# Wranglerのインストールと初期化
npm install -g wrangler
wrangler login
wrangler init
```

### 2.2. 依存関係の更新

```bash
# 既存の依存パッケージをインストール
npm install

# Cloudflare関連パッケージの追加
npm install @cloudflare/workers-types --save-dev
npm install @cloudflare/kv-asset-handler
```

## 3. ビルド設定の最適化

### 3.1. package.json の更新

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run optimize && npm run build && wrangler pages deploy dist",
    "optimize": "bash scripts/optimize-assets.sh"
  }
}
```

### 3.2. vite.config.js の最適化

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    outDir: "dist", // docsからdistに変更
    assetsDir: "assets",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          three: ["three"],
          animation: ["framer-motion", "react-parallax-tilt"],
          maps: ["google-maps"],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "framer-motion",
      "react-parallax-tilt",
      "swiper",
      "react-vertical-timeline-component",
    ],
  },
});
```

## 4. 環境変数の設定

### 4.1. 環境変数ファイルの移行

1. 現在の`.env.production`の内容を確認
2. Cloudflare Pages 用に新しい環境変数を設定

```env
# .env.production
VITE_GOOGLE_MAPS_API_KEY=<本番用APIキー>
VITE_GAS_ENDPOINT=<本番用エンドポイント>
```

### 4.2. Cloudflare Pages での環境変数設定

1. プロジェクト設定画面で以下を設定
   - Production 環境変数
     ```plaintext
     VITE_GOOGLE_MAPS_API_KEY=<本番用APIキー>
     VITE_GAS_ENDPOINT=<本番用エンドポイント>
     ```
   - Preview 環境変数
     ```plaintext
     VITE_GOOGLE_MAPS_API_KEY=<開発用APIキー>
     VITE_GAS_ENDPOINT=<開発用エンドポイント>
     ```

## 5. アセットの最適化

### 5.1. 最適化スクリプトの作成

```bash
#!/bin/bash
# scripts/optimize-assets.sh

# 画像の最適化
optimize_images() {
  find src/assets public/images -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) | while read img; do
    echo "Optimizing $img..."
    convert "$img" -strip -quality 85 -resize "1920x1920>" "$img"
  done
}

# GLBファイルの最適化
optimize_glb() {
  find public/orca -type f -name "*.glb" | while read model; do
    echo "Optimizing $model..."
    gltf-pipeline -i "$model" -o "${model%.glb}_optimized.glb" --draco.compressionLevel 7
  done
}

# Three.jsモデルの最適化
optimize_three_models() {
  find src/components/canvas -type f -name "*.jsx" | while read file; do
    echo "Updating Three.js optimizations in $file..."
    sed -i '' 's/useGLTF(/useGLTF.preload(/g' "$file"
  done
}

# 実行
optimize_images
optimize_glb
optimize_three_models
```

### 5.2. アセットのプリロード設定

```html
<!-- public/index.html -->
<head>
  <!-- クリティカルアセットのプリロード -->
  <link rel="preload" as="image" href="/orcx-logo.png" />
  <link
    rel="preload"
    as="fetch"
    href="/orca/Animation_Skill_01_withSkin.glb"
    crossorigin
  />

  <!-- フォントのプリロード -->
  <link
    rel="preload"
    as="font"
    href="/fonts/main.woff2"
    type="font/woff2"
    crossorigin
  />

  <!-- Three.jsのプリロード -->
  <link
    rel="modulepreload"
    href="/src/components/canvas/ThreePyramidOptimized.jsx"
  />
</head>
```

## 6. パフォーマンス最適化

### 6.1. wrangler.toml の設定

```toml
name = "orcx-website"
type = "webpack"
account_id = "<CLOUDFLARE_ACCOUNT_ID>"
workers_dev = true

[site]
bucket = "./dist"
entry-point = "workers-site"

[build]
command = "npm run build"
upload.format = "service-worker"

[build.upload]
format = "service-worker"

[env.production]
zone_id = "<ZONE_ID>"
route = "www.orcx.co.jp/*"

[env.production.build]
minify = true

[env.production.build.upload]
format = "service-worker"
```

### 6.2. キャッシュとパフォーマンス設定

```javascript
// workers-site/index.js
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    const response = await getAssetFromKV(event);
    const url = new URL(event.request.url);

    // アセットタイプに基づくキャッシュ設定
    if (url.pathname.match(/\.(glb|gltf)$/)) {
      response.headers.set("Cache-Control", "public, max-age=31536000");
      response.headers.set("Access-Control-Allow-Origin", "*");
    } else if (url.pathname.match(/\.(js|css|jpg|png|gif|svg|woff2)$/)) {
      response.headers.set("Cache-Control", "public, max-age=31536000");
    } else if (url.pathname.endsWith(".html")) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=0, must-revalidate"
      );
    }

    // セキュリティヘッダーの設定
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "interest-cohort=()");

    return response;
  } catch (e) {
    return new Response("Not Found", { status: 404 });
  }
}
```

## 7. デプロイ手順

### 7.1. プレビューデプロイ

```bash
# プレビュービルドの実行
npm run optimize
npm run build
wrangler pages dev ./dist

# 動作確認項目
- [ ] ページ表示
- [ ] Google Maps表示
- [ ] お問い合わせフォーム
- [ ] レスポンシブ対応
- [ ] アセット読み込み
- [ ] Three.js動作確認
- [ ] アニメーション動作確認
- [ ] パララックス効果確認
```

### 7.2. 本番デプロイ

```bash
# 本番デプロイの実行
npm run deploy

# デプロイ後の確認項目
- [ ] SSL/TLS接続
- [ ] パフォーマンススコア
- [ ] クロスブラウザ動作確認
- [ ] モバイル表示確認
- [ ] 3Dモデルのロード時間
- [ ] Google Mapsの表示速度
- [ ] フォーム送信機能
```

## 8. 監視設定

### 8.1. Cloudflare Analytics 設定

1. Analytics > Web Analytics を有効化
2. 以下のメトリクスを監視
   - ページビュー
   - エラーレート
   - パフォーマンス指標
   - Three.js 関連エラー
   - Google Maps API エラー

### 8.2. カスタム監視スクリプト

```javascript
// monitoring/status-check.js
async function checkWebsiteStatus() {
  try {
    const response = await fetch("https://www.orcx.co.jp");
    const status = response.status;

    if (status !== 200) {
      await notifyError(`Website returned status ${status}`);
    }

    // パフォーマンス指標の取得
    const perfData = await getPerformanceMetrics();
    if (perfData.ttfb > 800) {
      await notifyWarning("High TTFB detected");
    }

    // Three.jsの状態確認
    const threeStatus = await checkThreeJsStatus();
    if (!threeStatus.isOk) {
      await notifyWarning(`Three.js issues: ${threeStatus.message}`);
    }

    // Google Mapsの状態確認
    const mapsStatus = await checkGoogleMapsStatus();
    if (!mapsStatus.isOk) {
      await notifyWarning(`Google Maps issues: ${mapsStatus.message}`);
    }
  } catch (error) {
    await notifyError(`Website check failed: ${error.message}`);
  }
}

// 15分ごとに実行
setInterval(checkWebsiteStatus, 15 * 60 * 1000);
```

## 9. ロールバック手順

### 9.1. 即時ロールバック手順

```bash
# 1. 前回のデプロイにロールバック
wrangler pages deployment rollback

# 2. DNSレコードの復元
# さくらサーバーのDNSコントロールパネルで
# www CNAME レコードを元の値に戻す

# 3. キャッシュのパージ
wrangler pages deployment cache purge

# 4. 静的アセットの確認
wrangler pages deployment list --status=success
```

### 9.2. 段階的ロールバック

1. トラフィックの監視開始
2. DNS 伝播の確認
   ```bash
   # DNSの伝播を確認
   dig www.orcx.co.jp
   dig +trace www.orcx.co.jp
   ```
3. SSL 証明書の再確認
4. Three.js コンポーネントの動作確認
5. Google Maps API の動作確認

## 10. 注意事項

### 10.1. 制限事項

1. 無料プランの制限

   - ビルド時間: 最大 20 分
   - 同時ビルド数: 1
   - デプロイ回数: 500 回/月

2. パフォーマンス制限
   - ページサイズ上限: 25MB/ページ
   - キャッシュストレージ: 512MB
   - Three.js モデルサイズ制限: 最大 10MB
   - 画像ファイルサイズ制限: 最大 5MB

### 10.2. セキュリティ対策

1. 環境変数の管理

   - API Key の非公開設定
   - シークレット情報の暗号化
   - Google Maps API Key の制限設定

2. アクセス制御
   - CORS の適切な設定
   - CSP ヘッダーの設定
   - Three.js アセットのセキュリティ設定

### 10.3. バックアップ対策

1. コードバックアップ

   ```bash
   # リポジトリのバックアップ
   git clone --mirror https://github.com/kiku-hub/kiku-hub.github.io.git backup/repo
   ```

2. 定期的なスナップショット
   - 週次でのデプロイメントスナップショット保存
   - 重要な更新前のバックアップ取得
   - Three.js モデルとテクスチャの定期バックアップ

### 10.4. トラブルシューティング

1. デプロイ失敗時

   ```bash
   # ログの確認
   wrangler pages deployment list
   wrangler pages deployment log <deployment-id>
   ```

2. パフォーマンス問題

   - キャッシュの確認
   - アセット最適化の再実行
   - Three.js パフォーマンスの確認
   - Google Maps のロード時間確認

3. DNS 問題

   ```bash
   # DNS設定の確認
   dig www.orcx.co.jp
   dig +trace www.orcx.co.jp
   ```

4. Three.js 関連の問題

   ```bash
   # Three.jsデバッグモードの有効化
   THREE.Cache.enabled = true;
   console.log(THREE.Cache);
   ```

5. Google Maps 関連の問題
   ```javascript
   // Google Mapsデバッグ情報の取得
   console.log(google.maps.version);
   ```

### 10.5. 移行後の確認事項

1. GitHub Pages 関連の確認

   ```bash
   # 1. GitHub Pagesが無効化されていることを確認
   curl -I https://<username>.github.io/<repo>

   # 2. 古いCNAMEレコードが削除されていることを確認
   dig CNAME www.orcx.co.jp

   # 3. 不要になったdocsディレクトリの削除を確認
   ls -la docs/
   ```

2. Cloudflare Pages 確認

   ```bash
   # デプロイ状態の確認
   wrangler pages deployment list

   # ドメインの確認
   curl -I https://www.orcx.co.jp
   ```

3. リポジトリのクリーンアップ

   ```bash
   # 1. 不要なGitHub Pages関連ファイルの削除
   git rm -r docs/
   git rm .github/workflows/github-pages.yml # もし存在する場合

   # 2. package.jsonの更新
   # - gh-pagesパッケージの削除
   npm uninstall gh-pages

   # 3. 変更をコミット
   git add .
   git commit -m "Remove GitHub Pages related files and configurations"
   ```

4. ドキュメントの更新
   - README の更新
   - デプロイ手順の更新
   - CI/CD 設定の更新
