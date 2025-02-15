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

```bash
npm run build
```

ビルドされたファイルは`dist`ディレクトリに生成されます。
