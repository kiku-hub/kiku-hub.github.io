# ORCX Website

ORCX 株式会社の公式ウェブサイトのソースコードです。

## プロジェクト構造

```
.
├── src/               # ソースコード
│   ├── assets/       # 画像、SVGなどのアセット
│   ├── components/   # Reactコンポーネント
│   ├── constants/    # 定数定義
│   ├── hoc/          # 高階コンポーネント
│   ├── styles/       # スタイル定義
│   └── utils/        # ユーティリティ関数
├── public/           # 静的ファイル
├── dist/            # ビルド出力（自動生成）
└── docs/            # ドキュメント
```

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

### デプロイ手順

1. GitHub リポジトリの "Settings" > "Pages" を開く
2. "Build and deployment" セクションで以下を設定：
   - Source: "Deploy from a branch"
   - Branch: `main`
   - Folder: `/dist`
3. "Save" をクリック
4. 以下のコマンドでデプロイを実行：
   ```bash
   npm run deploy
   ```

デプロイが完了すると、`https://www.orcx.co.jp/` でアクセス可能になります。

### 注意事項

- ビルド時は`.env.production`の環境変数が使用されます
- `dist`ディレクトリは自動的に Git に追加されます
- カスタムドメイン（www.orcx.co.jp）の設定は自動的に保持されます
- SSL の設定は自動的に行われます
- デプロイには数分かかる場合があります

## メンテナンス

### 環境変数

- 開発環境: `.env.development`（gitignore されています）
- 本番環境: `.env.production`（リポジトリに含まれています）
- テンプレート: `.env.example`（新規開発者向け）

### 不要なディレクトリ

以下のディレクトリは現在使用されていません：

- `.next/`（Next.js の残骸）
- `biped/`
- `orca/`

これらは必要に応じて安全に削除できます。
