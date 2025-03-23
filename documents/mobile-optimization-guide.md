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
- Three.js は星空の背景（Stars.jsx）と重要な 3D モデルにのみ使用
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
│   ├── canvas/          # Three.js関連コンポーネント
│   ├── mvv/             # Mission/Vision/Value関連コンポーネント
│   └── ...              # その他のコンポーネント（セクション、共通UI）
├── hooks/               # カスタムフック（useMediaQueryなど）
├── utils/               # ユーティリティ関数
├── assets/              # アセット（画像、フォントなど）
├── constants/           # 定数（テキスト、設定など）
└── hoc/                 # 高階コンポーネント
```

### 2.2 主要ファイルと説明

```
components/
├── Hero.jsx            # 条件付きレンダリングを実装したヒーロー
├── About.jsx           # デバイスに応じた表示切替を含むAbout
├── Services.jsx        # デバイス別UI実装（SwiperまたはTab）
├── Products.jsx        # 製品情報表示
├── Company.jsx         # 会社情報表示
├── News.jsx            # ニュース情報表示
├── Contact.jsx         # コンタクトセクション
├── ContactForm.jsx     # 問い合わせフォーム
├── Navbar.jsx          # ナビゲーションバー
├── InitialLoader.jsx   # 初期ローディング表示
└── canvas/
    ├── Stars.jsx       # 背景星空アニメーション
    ├── Orca.jsx        # Orcaの3Dモデル
    └── ThreePyramidOptimized.jsx # 最適化された3Dピラミッド
hooks/
└── useMediaQuery.js    # メディアクエリ検出用カスタムフック
```

## 3. コンポーネント別実装要件

### 3.1 Hero セクション

**目的**: ファーストビューの最適化と高速表示

**実装例**:

```jsx
// components/Hero.jsx
import useMediaQuery from "../hooks/useMediaQuery";
import { OrcaCanvas } from "./canvas";

const Hero = () => {
  // モバイルかどうかを検出
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex justify-center items-center overflow-hidden"
    >
      {/* 共通テキストコンテンツ */}
      <div className="text-content z-10">
        <h1>ORCX</h1>
        <p>
          <span className="block sm:inline">IT業界の固定観念を覆し、</span>
          <span className="block sm:inline">
            本質を追求するエンジニア集団。
          </span>
        </p>
      </div>

      {/* モバイルの場合は静的な画像、デスクトップの場合は3Dモデル */}
      {isMobile ? (
        <div className="absolute inset-0 z-0 opacity-70">
          <img
            src="/images/hero-background.webp"
            alt="Hero Background"
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <OrcaCanvas />
        </div>
      )}
    </section>
  );
};
```

- メインビジュアル
  - モバイル: 最適化された静的画像
  - デスクトップ: Three.js による 3D モデル（OrcaCanvas）
- 画像最適化：WebP 形式、eager loading、高優先度設定
- テキスト表現
  - モバイル・デスクトップ共通: デスクトップと同様の視覚表現を維持
  - 「BREAK AND BUILD」のテキストアニメーション
  - 「BREAK the ordinary, CREATE new value」などのサブテキスト
  - 文字単位のアニメーション効果とグロー効果
  - レスポンシブフォントサイズを使用し、可読性を維持
- モバイル最適化
  - アニメーション数を抑制（パフォーマンス向上）
  - 文字サイズをビューポートに合わせて調整
  - グラデーションやグロー効果の軽量化
  - タッチ操作に適した余白とサイズ設定

### 3.2 About セクション

**目的**: 重いコンテンツを条件付きで表示して情報を明確に伝達

**実装例**:

```jsx
// components/About.jsx
import useMediaQuery from "../hooks/useMediaQuery";
import ThreePyramid from "./canvas/ThreePyramidOptimized";
import MVVContainer from "./mvv/MVVContainer";

const About = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className="relative min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div>
          <p className="sectionSubText">About Us</p>
          <h2 className="sectionHeadText">Mission, Vision, Value.</h2>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className={`flex-1 ${isMobile ? "w-full" : "w-1/2"}`}>
            <MVVContainer />
          </div>

          {/* モバイルでは3Dピラミッドは表示しない */}
          {!isMobile && (
            <div className="flex-1 w-1/2 h-[400px] relative">
              <ThreePyramid />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

- レイアウト
  - モバイル: MVV コンテナのみ（縦型レイアウト）
  - デスクトップ: MVV コンテナ + 3D ピラミッド（横型レイアウト）
- 3D コンテンツ: モバイルでは表示せず、デスクトップのみ表示

### 3.3 Services セクション

**目的**: デバイスに最適化された UI で情報を効果的に表示

**実装例**:

```jsx
// components/Services.jsx
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import useMediaQuery from "../hooks/useMediaQuery";

const Services = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const services = [
    /* サービス一覧 */
  ];

  return (
    <section className="services py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-8">Services</h2>

        {isMobile ? (
          // モバイル向け縦並びカード表示
          <div className="mobile-services-container space-y-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card bg-tertiary rounded-xl p-6 shadow-lg"
              >
                <div className="service-icon mb-4">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-16 h-16 mx-auto"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-bold text-center mb-3">
                  {service.title}
                </h3>
                <p className="text-secondary text-center">
                  {service.description}
                </p>
                {service.features && (
                  <ul className="mt-4 space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          // デスクトップ向けSwiperカルーセル
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 10,
              stretch: 0,
              depth: 300,
              modifier: 1,
              slideShadows: true,
            }}
            modules={[EffectCoverflow, Autoplay, Navigation]}
            className="mySwiper"
          >
            {services.map((service) => (
              <SwiperSlide key={service.title}>
                {/* サービスカード */}
                <div className="service-card bg-tertiary rounded-xl p-6">
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-secondary">{service.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};
```

- ユーザーインターフェース
  - モバイル: 縦に並んだカード表示（パフォーマンス重視の簡素なレイアウト）
  - デスクトップ: Swiper カルーセル（リッチな表現）
- モバイルでの最適化
  - 画像の遅延読み込み
  - アニメーションの軽量化
  - タッチしやすい十分な余白

### 3.4 Products セクション

**目的**: 製品情報の表示

**実装**:
現在の実装では、Products セクションはレスポンシブ対応されており、スタイルによって自動的にモバイルとデスクトップで適切な表示に調整されます。特別なデバイス検出は使用せず、CSS のメディアクエリとフレックスボックスによる対応が行われています。

### 3.5 Company セクション

**目的**: 会社情報の表示

**実装**:
Company セクションはレスポンシブ対応されており、CSS のメディアクエリを使用して、モバイルとデスクトップで適切なレイアウトに自動調整されます。特別なデバイス検出は使用せず、レスポンシブデザインの原則に従って実装されています。

### 3.6 News セクション

**目的**: 新着情報の表示

**実装**:
News セクションは、垂直タイムラインコンポーネントを使用して実装され、そのコンポーネント自体がレスポンシブ対応しています。特別なデバイス検出を使用せず、コンポーネントのレスポンシブ機能に依存しています。

### 3.7 Contact セクション

**目的**: 問い合わせフォームの表示

**実装**:
Contact セクションと ContactForm コンポーネントは、CSS のフレックスボックスとメディアクエリを使用してレスポンシブ対応しています。フォームの各要素がモバイル画面でも適切に表示されるよう最適化されています。

## 4. 実装のための共通機能

### 4.1 デバイス検出用カスタムフック

```jsx
// hooks/useMediaQuery.js
import { useState, useEffect } from "react";

/**
 * メディアクエリに基づいてデバイスタイプを検出するカスタムフック
 * @param {string} query - メディアクエリ文字列（例: "(max-width: 767px)"）
 * @returns {boolean} - クエリに一致するかどうか
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // SSR対応（windowがない場合は早期リターン）
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // 初期値を設定
    setMatches(mediaQuery.matches);

    // メディアクエリの変更を検出するリスナー
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // イベントリスナーを追加
    mediaQuery.addEventListener("change", handleChange);

    // クリーンアップ関数
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
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
  - Tailwind CSS によるレスポンシブクラス
  - コンテンツの適切な余白設定

## 6. パフォーマンス計測とモニタリング

- Lighthouse スコア定期計測
- Core Web Vitals の継続的モニタリング
- A/B テストによる検証
