# デプロイメント手順書

## 1. 開発環境のセットアップ

### 必要なツールのインストール

1. Node.js のインストール

```bash
# Macの場合
brew install nodenv
echo 'eval "$(nodenv init -)"' >> ~/.zshrc
source ~/.zshrc
nodenv install 18.17.0
nodenv global 18.17.0
```

2. npm の更新

```bash
npm install -g npm@latest
```

3. Git のインストール

```bash
# Macの場合
brew install git

# Gitの初期設定
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメール@orcx.co.jp"
```

4. Wrangler CLI のインストール

```bash
npm install -g wrangler
wrangler login  # ブラウザが開くので、Cloudflareにログインしてください
```

5. clasp のインストール

```bash
npm install -g @google/clasp
clasp login  # ブラウザが開くので、Googleにログインしてください
```

### プロジェクトのセットアップ

1. リポジトリのクローン

```bash
# SSHの場合
git clone git@github.com:kiku-hub/kiku-hub.github.io.git
cd kiku-hub.github.io

# HTTPSの場合
git clone https://github.com/kiku-hub/kiku-hub.github.io.git
cd kiku-hub.github.io
```

2. 依存パッケージのインストール

```bash
npm install
```

3. 環境変数の設定

```bash
# .env.developmentファイルを作成
cp .env.example .env.development

# .env.productionファイルを作成
cp .env.example .env.production

# 各ファイルに以下の内容を設定
VITE_GAS_ENDPOINT="Googleスプレッドシートのデプロイ用URL"
VITE_GOOGLE_MAPS_API_KEY="GoogleマップのAPIキー"
```

## 2. ステージング環境へのデプロイ

### 1. コードの準備

1. 最新のコードを取得

```bash
git checkout develop
git pull origin develop
```

2. 依存パッケージの更新

```bash
npm ci
```

### 2. ビルドとデプロイ

1. アセットの最適化

```bash
npm run optimize:assets
```

2. ステージング環境へのデプロイ

```bash
npm run deploy:staging
```

3. デプロイ後の確認項目

- [ ] https://staging.kiku-hub.github.io にアクセスできる
- [ ] ページが正しく表示される
- [ ] 3D モデルが表示される
- [ ] お問い合わせフォームが機能する
- [ ] Google Maps が表示される
- [ ] スマートフォンでの表示が崩れていない

## 3. 本番環境へのデプロイ

### 1. コードの準備

1. main ブランチに切り替え

```bash
git checkout main
git pull origin main
```

2. 依存パッケージの更新

```bash
npm ci
```

### 2. ビルドとデプロイ

1. アセットの最適化

```bash
npm run optimize:assets
```

2. 本番環境へのデプロイ

```bash
npm run deploy:production
```

3. デプロイ後の確認項目

- [○] https://www.orcx.co.jp にアクセスできる（カスタムドメイン）
- [○] kiku-hub-github-io.pages.dev にアクセスできる（GitHub Pages デフォルトドメイン）
- [○] SSL 証明書が有効
- [○] ページが正しく表示される
- [○] 3D モデルが表示される
- [ ] お問い合わせフォームが機能する
- [○] Google Maps が表示される
- [ ] スマートフォンでの表示が崩れていない

## 4. トラブルシューティング

### デプロイに失敗した場合

1. ログの確認

```bash
# Cloudflareのデプロイログを確認
wrangler pages deployment list
```

2. ロールバック方法

```bash
# 前回のデプロイに戻す
wrangler pages deployment rollback
```

### よくある問題と解決方法

1. ビルドエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm ci
```

2. 3D モデルが表示されない

```bash
# モデルの最適化を再実行
npm run optimize-models
```

3. 環境変数の問題

```bash
# 環境変数が正しく設定されているか確認
cat .env.production
```

## 5. 定期メンテナンス

### 毎週の確認項目

1. サイトの動作確認

- [ ] ページの表示速度
- [ ] 3D モデルの読み込み時間
- [ ] フォームの動作
- [ ] エラーログの確認

2. セキュリティ確認

- [ ] SSL 証明書の有効期限
- [ ] Cloudflare の設定
- [ ] アクセスログの確認

### 毎月の確認項目

1. パッケージの更新

```bash
npm outdated  # 更新可能なパッケージの確認
npm update    # パッケージの更新
```

2. バックアップの作成

```bash
# コードのバックアップ
git push origin main

# 環境変数のバックアップ
cp .env.production .env.production.backup
```

## 6. 参考リンク

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages)
- [Vite ドキュメント](https://vitejs.dev/guide/)
- [Three.js ドキュメント](https://threejs.org/docs/)
- [GitHub Pages ドキュメント](https://docs.github.com/ja/pages)
