# モバイル最適化実装

## 1. 概要と目的

### 1.1 目的

- モバイルユーザーのパフォーマンス改善
- ページ読み込み時間の大幅な短縮
- バッテリー消費の最適化
- データ通信量の削減

### 1.2 基本方針

- コンポーネントを統一し、条件付きレンダリングを採用
- デバイスタイプに応じた最適化表示を実装
- Three.js は stars.jsx のみ使用（背景演出用、モバイルでは軽量版を表示）
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
│   ├── sections/        # 統合されたセクションコンポーネント
│   ├── ui/              # 共通UIコンポーネント
│   └── shared/          # 共通コンポーネント
├── hooks/              # カスタムフック（useMediaQueryなど）
├── styles/             # スタイル定義
└── utils/              # ユーティリティ関数
```

### 2.2 主要ファイルと説明

```
components/
├── sections/
│   ├── About.tsx        # デバイスに応じた表示切替を含むAbout
│   ├── Hero.tsx         # 条件付きレンダリングを実装したヒーロー
│   ├── Services.tsx     # デバイス別UI実装（SwiperまたはTab）
│   └── ...
├── ui/
│   ├── Card.tsx         # 共通カードコンポーネント
│   ├── Button.tsx       # 共通ボタンコンポーネント
│   └── ...
└── shared/
    ├── Header.tsx       # レスポンシブ対応ヘッダー
    ├── Footer.tsx       # 共通フッター
    ├── Loading.tsx      # ローディング表示
    └── Stars.jsx        # デバイスに応じた背景アニメーション
hooks/
└── useDeviceDetect.ts   # デバイス検出用カスタムフック
```

## 3. コンポーネント別実装要件

### 3.1 Hero セクション

**目的**: ファーストビューの最適化と高速表示

**実装要件**:

```jsx
function Hero() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section className="hero">
      {/* 共通テキストコンテンツ */}
      <div className="hero-text">
        <h1>革新的なソリューションを提供します</h1>
        <p>最新のテクノロジーで、ビジネスの課題を解決</p>
      </div>

      {/* デバイス別ビジュアル表示 */}
      {isMobile ? (
        <div className="hero-visual-mobile">
          {/* モバイル最適化画像 */}
          <img
            src="/images/hero-mobile.webp"
            alt="ヒーローイメージ"
            width="750"
            height="1334"
            loading="eager"
            fetchpriority="high"
          />
        </div>
      ) : (
        <div className="hero-visual-desktop">
          {/* デスクトップ用フルスクリーンビジュアル */}
          <div className="hero-3d-visual">{/* 3Dモデルまたは高品質画像 */}</div>
        </div>
      )}
    </section>
  );
}
```

- メインビジュアル
  - モバイル:
    - 解像度: 750x1334px
  - フォーマット: WebP（代替として JPEG）
  - 読み込み優先度: High Priority
  - デスクトップ:
    - フルスクリーン対応高解像度画像または 3D モデル
- アニメーション
  - 表示順: テキスト → 画像
  - 遅延: 100ms（テキスト）, 300ms（画像）

### 3.2 About セクション

**目的**: 重いコンテンツを条件付きで表示して情報を明確に伝達

**実装例**:

```jsx
function About() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section className="about">
      {/* 共通タイトル */}
      <h2>About Us</h2>

      {/* 共通カード表示 */}
      <div className={`card-container ${isMobile ? "vertical" : "horizontal"}`}>
        <Card
          title="Value"
          content="本質を追求する技術と革新的思考で、より良い未来を創造する"
          animation={isMobile ? "fade" : "rotate"}
        />
        <Card
          title="Vision"
          content="固定観念を覆し、本質を見据えた新たな可能性を広げる"
          animation={isMobile ? "fade" : "rotate"}
        />
        <Card
          title="Mission"
          content="先端技術と革新的な思考を融合し、実用的な価値を社会に届ける"
          animation={isMobile ? "fade" : "rotate"}
        />
      </div>

      {/* デスクトップのみ3Dモデル表示 */}
      {!isMobile && (
        <div className="about-3d-model">
          {/* 3Dモデル - デスクトップのみ表示 */}
        </div>
      )}
    </section>
  );
}
```

- カード表示（3 種類）は共通で実装
  1. Value Card
  2. Vision Card
  3. Mission Card
- レイアウト
  - モバイル: 縦スクロール型
  - デスクトップ: 横並び＋ 3D モデル表示
- アニメーション
  - モバイル: 軽量なフェードインのみ
  - デスクトップ: 高度なアニメーション効果

### 3.3 Services セクション

**目的**: デバイスに最適化された UI で情報を効果的に表示

**実装例**:

```jsx
function Services() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const services = [
    {
      id: 1,
      title: "ITソリューション事業",
      description: "本質的価値を創造する、真のテクノロジーパートナーへ。",
    },
    // 他のサービス定義
  ];

  return (
    <section className="services">
      <h2>Services</h2>

      {isMobile ? (
        // モバイル用タブインターフェース
        <TabInterface services={services} />
      ) : (
        // デスクトップ用Swiperインターフェース
        <SwiperInterface services={services} />
      )}
    </section>
  );
}

// モバイル用タブコンポーネント
function TabInterface({ services }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tab-container">
      <div className="tab-headers">
        {services.map((service, index) => (
          <button
            key={service.id}
            className={activeTab === index ? "active" : ""}
            onClick={() => setActiveTab(index)}
          >
            {service.title}
          </button>
        ))}
      </div>
      <div className="tab-content">
        <div className="service-detail">
          <h3>{services[activeTab].title}</h3>
          <p>{services[activeTab].description}</p>
        </div>
      </div>
    </div>
  );
}

// デスクトップ用Swiperコンポーネント
function SwiperInterface({ services }) {
  return (
    <div className="swiper-container">{/* デスクトップ用Swiperの実装 */}</div>
  );
}
```

- サービス一覧は共通データとして管理
- UI 実装
  - モバイル: タブインターフェース
  - タブ表示: 横スクロール可能
  - インジケーター: ドット形式
  - デスクトップ: Swiper ベースのカルーセル

### 3.4 Products セクション

**目的**: 製品情報をデバイスに合わせて効率的に表示

**実装例**:

```jsx
function Products() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section className="products">
      <h2>Products</h2>

      <div className={`product-card ${isMobile ? "mobile" : "desktop"}`}>
        <h3>Arch - SES業界に特化した統合プラットフォーム</h3>

        <div className="product-content">
          <p>
            {
              isMobile
                ? "SES業界向けの統合管理プラットフォーム" // モバイル用簡潔な説明
                : "SES業界に特化した革新的な統合プラットフォームで、業務効率を最大化し..." // デスクトップ用詳細説明
            }
          </p>

          <div className="product-image">
            <img
              src={
                isMobile
                  ? "/images/arch-mobile.webp"
                  : "/images/arch-desktop.webp"
              }
              alt="Arch - Coming Soon"
              loading="lazy"
              width={isMobile ? "300" : "600"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- 表示内容
  - モバイル: 簡潔な説明と最適化された画像
  - デスクトップ: 詳細な説明と高品質な画像

### 3.5 Company セクション

**目的**: 会社情報の効率的な表示（レイアウトのみ最適化）

**実装例**:

```jsx
function Company() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const companyInfo = [
    { label: "会社名", value: "ORCX株式会社" },
    { label: "代表者", value: "吉田 翔一朗" },
    // 他の会社情報
  ];

  return (
    <section className="company">
      <h2>Company</h2>

      <div className={`company-info ${isMobile ? "list-view" : "grid-view"}`}>
        {companyInfo.map((info, index) => (
          <div key={index} className="info-item">
            <div className="info-label">{info.label}</div>
            <div className="info-value">{info.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- 表示内容は共通
- レイアウト
  - モバイル: リスト表示（縦長）
  - デスクトップ: グリッド表示（横幅を活用）

### 3.6 News セクション

**目的**: 新着情報の効率的な表示

**実装例**:

```jsx
function News() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const newsItems = [
    {
      id: 1,
      date: "2025年3月3日",
      title: "会社設立のお知らせ",
      content: "ORCX株式会社を設立いたしました。",
    },
    // 他のニュース
  ];

  return (
    <section className="news">
      <h2>News</h2>

      <div className={`news-container ${isMobile ? "compact" : "expanded"}`}>
        {newsItems.map((news) => (
          <div key={news.id} className="news-item">
            <div className="news-date">{news.date}</div>
            <div className="news-title">{news.title}</div>
            {!isMobile && <div className="news-content">{news.content}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
```

- モバイル: タイトルと日付のみの簡潔表示
- デスクトップ: 詳細コンテンツを含む展開表示

### 3.7 Contact セクション

**目的**: スムーズな問い合わせフロー

**実装例**:

```jsx
function Contact() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section className="contact">
      <h2>Contact</h2>

      <form className={`contact-form ${isMobile ? "stacked" : "two-column"}`}>
        {/* フォーム要素 - 共通 */}
        <div className="form-group">
          <label htmlFor="type">お問い合わせ種別</label>
          <select id="type" name="type" required>
            <option value="">選択してください</option>
            <option value="business">ビジネスに関するお問い合わせ</option>
            <option value="recruit">採用に関するお問い合わせ</option>
            <option value="other">その他</option>
          </select>
        </div>

        {/* 他のフォーム要素 */}

        <div className="form-submit">
          <button type="submit" className={isMobile ? "full-width" : "normal"}>
            送信する
          </button>
        </div>
      </form>
    </section>
  );
}
```

- フォーム要素は共通
- レイアウト
  - モバイル: 縦並び（スタック）レイアウト
  - デスクトップ: 2 カラムレイアウト
- ボタン
  - モバイル: 全幅表示
  - デスクトップ: 通常幅

## 4. 実装のための共通機能

### 4.1 デバイス検出用カスタムフック

```jsx
// hooks/useDeviceDetect.ts
import { useState, useEffect } from "react";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
```

### 4.2 条件付きレンダリング用ヘルパーコンポーネント

```jsx
// components/ui/DeviceView.tsx
import React from "react";
import useMediaQuery from "../../hooks/useMediaQuery";

type DeviceViewProps = {
  mobileContent: React.ReactNode,
  desktopContent: React.ReactNode,
  breakpoint?: string,
};

function DeviceView({
  mobileContent,
  desktopContent,
  breakpoint = "(max-width: 767px)",
}: DeviceViewProps) {
  const isMobile = useMediaQuery(breakpoint);

  return isMobile ? mobileContent : desktopContent;
}

export default DeviceView;
```

## 5. 共通最適化要件

### 5.1 パフォーマンス最適化

- 画像最適化
  - WebP フォーマット使用
  - デバイス別の適切な解像度設定
  - 遅延読み込み実装（`loading="lazy"`）
- JavaScript 最適化
  - コード分割（React.lazy と Suspense）
  - 条件付きインポート（デバイス別）
- アニメーション最適化
  - モバイル: 軽量なアニメーションのみ使用
  - デスクトップ: フルアニメーション対応

### 5.2 アクセシビリティ対応

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

### 5.3 レスポンシブ設計

- ブレイクポイント
  - モバイル: 〜767px
  - タブレット: 768px〜1023px
  - デスクトップ: 1024px〜
- レイアウト
  - フレックスボックス活用
  - グリッドシステム適用
  - コンテンツの適切な余白設定

## 6. パフォーマンス計測とモニタリング

- Lighthouse スコア定期計測
- Core Web Vitals の継続的モニタリング
- A/B テストによる検証
