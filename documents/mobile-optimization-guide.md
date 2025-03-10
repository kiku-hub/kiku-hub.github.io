# モバイル最適化実装

## 1. 概要と目的

### 1.1 目的

- モバイルユーザーのパフォーマンス改善
- ページ読み込み時間の大幅な短縮
- バッテリー消費の最適化
- データ通信量の削減

### 1.2 基本方針

- 既存のコンポーネント構造を維持
- モバイル版は別ファイルとして実装
- Three.js は stars.jsx のみ使用（背景演出用）
- パフォーマンスを最優先

### 1.3 期待される改善効果

| 指標 | 現在値   | 目標値   | 改善率   |
| ---- | -------- | -------- | -------- |
| FCP  | 5.7 秒   | 1.8 秒   | 68%減    |
| LCP  | 10.0 秒  | 2.5 秒   | 75%減    |
| TBT  | 12,780ms | 500ms    | 96%減    |
| CLS  | 0        | 0.1 以下 | 現状維持 |

## 2. ファイル構造と役割

### 2.1 ディレクトリ構成

```
src/
├── components/          # コンポーネントディレクトリ
│   ├── desktop/        # デスクトップ専用コンポーネント
│   ├── mobile/         # モバイル専用コンポーネント
│   └── shared/         # 共通コンポーネント
├── hooks/              # カスタムフック
├── styles/             # スタイル定義
└── utils/              # ユーティリティ関数
```

### 2.2 主要ファイルと説明

```
components/
├── desktop/
│   ├── About.tsx        # 3Dモデル含むデスクトップ版About
│   ├── Hero.tsx        # フルスクリーンヒーロー
│   ├── Services.tsx    # Swiperベースのサービス一覧
│   └── ...
├── mobile/
│   ├── About.tsx       # 軽量化されたモバイル版About
│   ├── Hero.tsx        # 最適化されたヒーロー
│   ├── Services.tsx    # タブベースのサービス一覧
│   └── ...
└── shared/
    ├── Header.tsx      # レスポンシブ対応ヘッダー
    ├── Footer.tsx      # 共通フッター
    ├── Loading.tsx     # ローディング表示
    └── Stars.jsx       # 軽量化された背景アニメーション
```

## 3. コンポーネント別実装要件

### 3.1 Hero セクション

**目的**: ファーストビューの最適化と高速表示

**実装要件**:

- メインビジュアル
  - 解像度: 750x1334px（モバイル最適化）
  - フォーマット: WebP（代替として JPEG）
  - 読み込み優先度: High Priority
- テキストコンテンツ
  - メイン: 「革新的なソリューションを提供します」
  - サブ: 「最新のテクノロジーで、ビジネスの課題を解決」
- アニメーション
  - 表示順: テキスト → 画像
  - 遅延: 100ms（テキスト）, 300ms（画像）

### 3.2 About セクション

**目的**: 3D モデルを除外し、情報の明確な伝達

**実装要件**:

- カード表示（3 種類）
  1. Value Card
     - タイトル: 「Value」
     - 本文: 「本質を追求する技術と革新的思考で、より良い未来を創造する」
  2. Vision Card
     - タイトル: 「Vision」
     - 本文: 「固定観念を覆し、本質を見据えた新たな可能性を広げる」
  3. Mission Card
     - タイトル: 「Mission」
     - 本文: 「先端技術と革新的な思考を融合し、実用的な価値を社会に届ける」
- レイアウト
  - 縦スクロール型
  - カード間隔: 16px
  - アニメーション: フェードイン（スクロール連動）

### 3.3 Services セクション

**目的**: 直感的な操作性と情報の明確な区分け

**実装要件**:

- タブインターフェース
  - タブ表示: 横スクロール可能
  - インジケーター: ドット形式
- サービス一覧
  1. IT ソリューション事業
     - 説明: 「本質的価値を創造する、真のテクノロジーパートナーへ。」
  2. 自社サービス事業
     - 説明: 「テクノロジーで、仕事をもっとシンプルに。」
  3. システム受託開発事業
     - 説明: 「確かな技術力で、ビジネスの未来を創造します。」
  4. AI サーバー構築事業
     - 説明: 「最先端 GPU インフラで、AI 活用を加速します。」
- アニメーション
  - タブ切り替え: スライド効果
  - コンテンツ: フェードイン

### 3.4 Products セクション

**目的**: 製品情報の効率的な表示

**実装要件**:

- Arch プロダクト表示
  - タイトル: 「Arch - SES 業界に特化した統合プラットフォーム」
  - 説明文の最適化表示
  - Coming Soon 画像（WebP 形式）

### 3.5 Company セクション

**目的**: 会社情報の明確な提示

**実装要件**:

- 情報一覧
  - 会社名: ORCX 株式会社
  - 代表者: 吉田 翔一朗
  - 事業内容: 4 事業を箇条書き
  - 所在地: 東京都世田谷区用賀 4-18-7
  - 設立: 2025 年 3 月 3 日
  - 資本金: 300 万円
  - メール: info@orcx.co.jp
- レイアウト
  - リスト形式
  - アイコン付き表示

### 3.6 News セクション

**目的**: 新着情報の効率的な表示

**実装要件**:

- ニュースカード
  - 会社設立情報を優先表示
  - アイコンとテキストの最適化
  - 日付: 2025 年 3 月

### 3.7 Contact セクション

**目的**: スムーズな問い合わせフロー

**実装要件**:

- フォーム最適化
  - 入力項目の明確な区分け
  - バリデーションの即時フィードバック
  - 送信ボタンの視認性向上
- 必須項目
  - お問い合わせ種別（セレクトボックス）
  - 会社名/組織名
  - お名前
  - フリガナ
  - 電話番号
  - メールアドレス
  - お問い合わせ内容
  - プライバシーポリシー同意

## 4. 共通最適化要件

### 4.1 パフォーマンス最適化

- 画像最適化
  - WebP フォーマット使用
  - 適切な解像度設定
  - 遅延読み込み実装
- JavaScript 最適化
  - コード分割
  - 必要最小限の機能のみ読み込み
- アニメーション最適化
  - CSS 優先使用
  - 重い処理の省略

### 4.2 アクセシビリティ対応

- タッチ操作
  - タッチターゲットサイズ: 最小 44x44px
  - タップフィードバック実装
- 文字サイズ
  - 最小: 14px
  - 基本: 16px
  - 見出し: 20px 以上
- コントラスト比
  - テキスト: 4.5:1 以上
  - 大きな文字: 3:1 以上

### 4.3 レスポンシブ設計

- ブレイクポイント
  - モバイル: 〜767px
  - タブレット: 768px〜1023px
  - デスクトップ: 1024px〜
- レイアウト
  - フレックスボックス活用
  - グリッドシステム適用
  - コンテンツの適切な余白設定
