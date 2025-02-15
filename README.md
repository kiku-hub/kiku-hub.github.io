# ORCX Website

ORCX 株式会社の公式ウェブサイトのソースコードです。

## 開発環境のセットアップ

1. リポジトリをクローン

```bash
git clone https://github.com/kiku-hub/kiku-hub.github.io.git
cd kiku-hub.github.io
```

2. 依存パッケージをインストール

```bash
npm install
```

3. 環境設定

- `.env.example`ファイルをコピーして`.env.development`を作成
- 必要な環境変数を設定
  - Google Maps API Key
  - Google Apps Script Deployment URL
  - その他必要な設定

4. 開発サーバーを起動

```bash
npm run dev
```

## 本番環境

本番環境の設定は`.env.production`で管理されています。
環境変数の変更が必要な場合は、リポジトリ管理者に連絡してください。

## ビルドとデプロイ

本番環境用のビルドを実行：

```bash
npm run build
```

ビルドが完了すると、`dist`ディレクトリに最適化された静的ファイルが生成されます。
これらのファイルは自動的に GitHub Pages にデプロイされます。

### 注意事項

- ビルド時は`.env.production`の環境変数が使用されます
- 生成された`dist`ディレクトリの内容は自動的にルートディレクトリにコピーされます
- GitHub Actions によって自動デプロイが行われます
