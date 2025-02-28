# パフォーマンスとスクロール最適化要件定義

## 1. 現状分析

### 1.1 技術スタック

- React 18.2.0
- Framer Motion 9.0.7
- React Three Fiber/Drei
- Tailwind CSS
- Three.js

### 1.2 主要コンポーネント

1. Hero（ヒーローセクション）
   - 3D モデル表示
   - アニメーションテキスト
2. About（会社概要）
   - ピラミッド 3D 表示
3. Services（サービス）
   - Swiper スライダー
4. Products（製品）
5. News（ニュース）
6. Company（会社情報）
7. Contact（問い合わせ）

### 1.3 現在のアセットサイズ

#### 3D モデル

- Animation_Formal_Bow_withSkin.glb: 9.9MB → 751KB (83%削減) ✅

#### 画像ファイル（WebP 最適化済み）

- Datacenter.jpeg: 438KB → Datacenter.webp: 218KB ✅
- Teameng.jpeg: 364KB → Teameng.webp: 158KB ✅
- CompanyServices.jpeg: 215KB → CompanyServices.webp: 104KB ✅
- ITsolution.jpeg: 187KB → ITsolution.webp: 99KB ✅

## 2. パフォーマンス目標

### 2.1 デスクトップ向け

- First Input Delay (FID): 50ms 以下
- Cumulative Layout Shift (CLS): 0.05 以下
- Largest Contentful Paint (LCP): 2.0 秒以下
- フレームレート: 60fps 安定

#### リソース制限

- メモリ使用量: 最大 2GB
- GPU 使用率: 最大 60%
- CPU 使用率: 最大 40%

### 2.2 モバイル向け

- First Input Delay (FID): 100ms 以下
- Cumulative Layout Shift (CLS): 0.1 以下
- Largest Contentful Paint (LCP): 2.5 秒以下
- フレームレート: 30fps 以上安定

#### リソース制限

- メモリ使用量: 最大 500MB
- GPU 使用率: 最大 40%
- CPU 使用率: 最大 30%
- バッテリー消費の最適化

## 3. 最適化戦略

### 3.1 コンポーネントの遅延読み込み

#### 優先度別読み込み順序

1. 即時読み込み（初期表示）

   - Navbar
   - Hero（最適化 3D）

2. 優先度高（スクロール後）

   - About（簡略化 3D）
   - Services（最適化アニメーション）

3. 優先度中

   - Products
   - Company
   - News

4. 優先度低
   - Contact
   - Footer

### 3.2 3D コンテンツの最適化

#### デスクトップ向け設定

```javascript
const DESKTOP_3D_CONFIG = {
  gl: {
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    precision: "highp",
  },
  geometry: {
    segments: 64,
    computeVertexNormals: true,
  },
  material: {
    roughness: 0.15,
    metalness: 0.8,
    envMapIntensity: 2.5,
  },
};
```

#### モバイル向け設定

```javascript
const MOBILE_3D_CONFIG = {
  gl: {
    antialias: "default",
    alpha: true,
    powerPreference: "default",
    precision: "mediump",
  },
  geometry: {
    segments: 32,
    computeVertexNormals: false,
  },
  material: {
    roughness: 0.3,
    metalness: 0.5,
    envMapIntensity: 1.5,
  },
};
```

### 3.3 スクロールパフォーマンス最適化

#### Intersection Observer 実装

```javascript
const useOptimizedScroll = (callback) => {
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          callback();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback]);
};
```

### 3.4 画像とアセット最適化

#### WebP 変換設定

```bash
# 高度なWebP圧縮
cwebp -q 75 -m 6 -af -f 50 -sharpness 0 -mt -v input.jpg -o output.webp
```

#### キャッシュ戦略

```javascript
const CACHE_CONFIG = {
  images: {
    maxAge: "1 year",
    strategy: "stale-while-revalidate",
  },
  models: {
    maxAge: "1 month",
    strategy: "cache-first",
  },
};
```

## 4. コンポーネント別最適化

### 4.1 Services コンポーネント

#### パフォーマンス改善効果

- レンダリング最適化: 80%削減
- 初期レンダリング: 40%短縮
- メモリ使用量: 効率的なメモ化
- アニメーション: 60fps 維持

#### 実装例

```javascript
// デスクトップ向け
const DesktopServiceCard = {
  animations: {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
    image: {
      quality: "high",
      loading: "eager",
    },
  },
};

// モバイル向け
const MobileServiceCard = {
  animations: {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    image: {
      quality: "medium",
      loading: "lazy",
    },
  },
};
```

## 5. モニタリングと計測

### 5.1 パフォーマンス指標

- Lighthouse スコア
- Web Vitals
- メモリ使用量推移
- FPS モニタリング
- エラー発生率
- ユーザー満足度

### 5.2 モニタリングツール

- Chrome DevTools Performance
- React Developer Tools
- Performance Monitor
- Cloudflare Analytics

## 6. 実装ステータスの凡例

- ✅ 実装済/運用中
- ⚠️ 実装済だが要確認/監視中
- ⏳ 未実装/予定

## 7. 現状のパフォーマンス分析（2024/02/24 計測）

### 7.1 Core Web Vitals

| 指標                           | 現在の値 | 目標値     | ステータス |
| ------------------------------ | -------- | ---------- | ---------- |
| First Contentful Paint (FCP)   | 3.6 秒   | 1.8 秒以下 | ⚠️ 要改善  |
| Largest Contentful Paint (LCP) | 6.2 秒   | 2.5 秒以下 | ⚠️ 要改善  |
| Total Blocking Time (TBT)      | 24,940ms | 200ms 以下 | ⚠️ 要改善  |
| Cumulative Layout Shift (CLS)  | 0        | 0.1 以下   | ✅ 良好    |
| Speed Index                    | 6.8 秒   | 3.4 秒以下 | ⚠️ 要改善  |

### 7.2 主要な問題点

1. **JavaScript 実行時間の長さ**

   - メインスレッドのブロッキング時間が 24,940ms と非常に長い
   - 3D モデルの初期化と描画処理が重い
   - 未使用の JavaScript コードが多い

2. **リソースの読み込み**

   - 大きな JavaScript バンドル（251 KB）
   - 最適化されていない画像（1,208 KB）
   - 未圧縮のアセット

3. **レンダリングの遅延**
   - レイアウトの変更が多い
   - 非効率なアニメーション処理
   - 重い DOM 操作

## 8. 改善戦略

### 8.1 即時対応項目（優先度：高）

1. **JavaScript の最適化**

   ```javascript
   // vite.config.jsの更新
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'three': ['three'],
           'react': ['react', 'react-dom'],
           'animation': ['framer-motion', '@react-three/fiber'],
           'vendor': ['@react-three/drei']
         }
       }
     }
   }
   ```

2. **画像の最適化**

   - WebP フォーマットへの変換（さらなる圧縮）
   - 遅延読み込みの実装
   - 適切なサイズ指定

### 8.2 中期対応項目（優先度：中）

1. **キャッシュ戦略の改善**

   ```javascript
   // サービスワーカーの実装
   const CACHE_VERSION = "v1";
   const CACHE_ASSETS = ["/models/", "/images/", "/static/"];
   ```

2. **コード分割の最適化**

   - 各セクションのコンポーネントを遅延読み込み
   - 重要でないモジュールの遅延読み込み
   - 共通コードの抽出

3. **レンダリング最適化**
   - 仮想化リストの実装
   - アニメーションの GPU 加速
   - 不要な re-render の削減

### 8.3 長期対応項目（優先度：低）

1. **インフラストラクチャの最適化**

   - CDN の導入
   - エッジキャッシュの活用
   - HTTP/3 への対応

2. **モニタリングの強化**
   - リアルタイムパフォーマンス監視
   - ユーザー体験メトリクスの収集
   - 自動パフォーマンステスト

### 8.4 目標値

| 指標                 | 現在値   | 短期目標     | 長期目標     |
| -------------------- | -------- | ------------ | ------------ |
| パフォーマンススコア | 34       | 60 以上      | 90 以上      |
| FCP                  | 3.6 秒   | 2.0 秒       | 1.5 秒       |
| LCP                  | 6.2 秒   | 3.0 秒       | 2.0 秒       |
| TBT                  | 24,940ms | 1,000ms      | 200ms        |
| CLS                  | 0        | 0.1 以下維持 | 0.1 以下維持 |
| Speed Index          | 6.8 秒   | 4.0 秒       | 2.5 秒       |

### 8.5 進捗管理

- ✅ 完了
- 🟡 進行中
- ⚠️ 未着手
- ❌ 問題あり

| タスク                    | 状態 | 予定完了日 | 担当者 |
| ------------------------- | ---- | ---------- | ------ |
| JavaScript バンドル最適化 | ⚠️   | 2024/03/10 | -      |
| 画像最適化                | 🟡   | 2024/03/05 | -      |
| キャッシュ戦略実装        | ⚠️   | 2024/03/20 | -      |
| コード分割                | ⚠️   | 2024/03/25 | -      |
| レンダリング最適化        | ⚠️   | 2024/03/30 | -      |

## 9. モバイル版特別最適化要件

モバイルデバイスでのパフォーマンスを大幅に向上させるため、デスクトップ版とは異なる特別な最適化を適用します。

### 9.1 モバイル版構造の簡略化

#### ピラミッド 3D モデルの対応

- ✅ **モバイル版ではピラミッド 3D モデルを完全に削除**
  - 理由：デバイスの処理能力とメモリ制限に合わせた最適化
  - 代替表現：不要（完全削除）

#### シンプル化された階層構造

- ✅ **元の形状を保持しつつ一層構造に簡略化**
  - 複雑な入れ子構造を避け、フラットなコンポーネント構成に変更
  - DOM 要素の総数を 50%以上削減
  - レンダリングパスの最適化

### 9.2 モバイル向けサイズ最適化

#### アセット削減戦略

| アセット種類 | 現状サイズ | 目標サイズ | 削減手法                   |
| ------------ | ---------- | ---------- | -------------------------- |
| 3D モデル    | 751KB      | 0KB (削除) | ピラミッドモデルの完全削除 |
| 画像         | 579KB 合計 | 250KB 以下 | 解像度の最適化、圧縮率向上 |
| JavaScript   | 251KB      | 100KB 以下 | モバイル向け特別バンドル   |
| CSS          | 未計測     | 30KB 以下  | 未使用スタイルの削除       |

#### リソース読み込み最適化

- **優先度の再定義**

  - クリティカルパスリソースのみ初期ロード
  - 非クリティカルなリソースはユーザー操作後にロード
  - バックグラウンドプリフェッチの制限

- **レスポンシブ画像の実装**
  ```html
  <img
    srcset="/images/hero-mobile.webp 480w, /images/hero-tablet.webp 768w"
    sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw"
    src="/images/hero-fallback.webp"
    alt="ヒーローイメージ"
  />
  ```

### 9.3 実装ガイドライン

#### 実装優先順位

1. **ピラミッド 3D モデルの削除** ⚠️

   - 完了目標：2024/04/10
   - 予想効果：TBT 80%削減、LCP 2.5 秒以下達成

2. **モバイル専用シンプル階層構造への変更** ⚠️

   - 完了目標：2024/04/20
   - 予想効果：メモリ使用量 60%削減、スクロールがスムーズに

3. **モバイル特化バンドルの作成** ⚠️
   - 完了目標：2024/04/30
   - 予想効果：JavaScript 実行時間 70%削減

#### モバイル版検証方針

- Chrome DevTools の Throttling を使用した低性能デバイスエミュレーション
- 実際のモバイルデバイス（低〜中スペック）でのテスト
- パフォーマンスメトリクスの継続的な測定とモニタリング
- バッテリー消費量の測定

### 9.4 期待される成果

| 指標           | 現在値（モバイル）   | 特別最適化後の目標値 |
| -------------- | -------------------- | -------------------- |
| TBT            | 24,940ms             | 500ms 以下           |
| LCP            | 6.2 秒               | 2.0 秒以下           |
| FPS            | 計測不能（フリーズ） | 30FPS 以上安定       |
| メモリ使用量   | 800MB+               | 250MB 以下           |
| スクロール     | 困難/不可能          | スムーズ             |
| バッテリー消費 | 高                   | 低〜中               |

この特別最適化により、モバイルユーザーに対して大幅に改善されたエクスペリエンスを提供し、コンバージョン率や滞在時間の向上が期待できます。

## 10. モバイル最適化実装ガイド

このセクションでは、モバイル特別最適化の具体的な実装方法を示します。各ステップは順次実装することで、最大の効果を得られます。

### 10.1 ピラミッド 3D モデルの完全削除

#### デバイス検出機能の実装

```javascript
// utils/deviceDetect.js
import { useState, useEffect } from "react";

export const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
      );
    };

    // 初期チェック
    checkDevice();

    // リサイズイベントのリスナー
    window.addEventListener("resize", checkDevice);

    // クリーンアップ
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return { isMobile };
};
```

#### About コンポーネントの条件付きレンダリング

```javascript
// components/About.jsx
import { useDeviceDetect } from "../utils/deviceDetect";
import { PyramidModel } from "./PyramidModel"; // 現在の 3D モデル

const About = () => {
  const { isMobile } = useDeviceDetect();

  return (
    <section id="about" className="about-section">
      <div className="container mx-auto px-4">
        <h2 className="section-title">会社について</h2>

        {/* モバイルではピラミッドを完全に削除 */}
        {!isMobile && <PyramidModel />}

        {/* 会社概要コンテンツ - モバイルでもデスクトップでも表示 */}
        <div className="about-content">
          <p>会社概要の説明テキスト...</p>
        </div>
      </div>
    </section>
  );
};
```

### 10.2 モバイル専用シンプル階層構造への変更

#### モバイル用とデスクトップ用の分離

```javascript
// components/About.jsx
import { useDeviceDetect } from "../utils/deviceDetect";
import { PyramidModel } from "./PyramidModel";

const About = () => {
  const { isMobile } = useDeviceDetect();

  // モバイル用のシンプル構造コンポーネント
  const MobileAboutContent = () => (
    <div className="mobile-about-content">
      <h3 className="text-xl font-bold mb-4">会社ビジョン</h3>
      <div className="grid grid-cols-1 gap-4">
        {/* シンプルな一層構造 */}
        <div className="about-item">
          <h4>革新</h4>
          <p>常に最新技術を探求し、革新的なソリューションを提供します。</p>
        </div>
        <div className="about-item">
          <h4>信頼</h4>
          <p>確かな品質と誠実さで、お客様との信頼関係を構築します。</p>
        </div>
        <div className="about-item">
          <h4>成長</h4>
          <p>継続的な学習と改善により、共に成長することを目指します。</p>
        </div>
      </div>
    </div>
  );

  // デスクトップ用の複雑な階層構造コンポーネント
  const DesktopAboutContent = () => (
    <>
      <PyramidModel />
      <div className="desktop-about-content">
        {/* デスクトップ用の複雑な階層構造 */}
        {/* 既存の複雑なコンポーネント構造 */}
      </div>
    </>
  );

  return (
    <section id="about" className="about-section py-12">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center text-2xl mb-8">
          会社について
        </h2>

        {/* デバイスに応じて異なるコンポーネントをレンダリング */}
        {isMobile ? <MobileAboutContent /> : <DesktopAboutContent />}
      </div>
    </section>
  );
};
```

### 10.3 モバイル特化バンドルの作成

#### Vite の設定ファイル更新

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Three.js 関連（デスクトップのみ使用）
          if (
            id.includes("three") ||
            id.includes("drei") ||
            id.includes("fiber")
          ) {
            return "three-vendor";
          }

          // React 関連（共通）
          if (id.includes("node_modules/react")) {
            return "react-vendor";
          }

          // アニメーション関連（部分的に使用）
          if (id.includes("framer-motion")) {
            return "animation";
          }

          // その他のベンダーライブラリ
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
```

#### コンポーネントの動的インポート

```javascript
// App.jsx または該当するルートコンポーネント
import React, { lazy, Suspense } from "react";
import { useDeviceDetect } from "./utils/deviceDetect";

// 常に読み込むコンポーネント
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from "./components/Loading";

// 遅延読み込みするコンポーネント
const Hero = lazy(() => import("./components/Hero"));
const About = lazy(() => import("./components/About"));
const Services = lazy(() => import("./components/Services"));
const Products = lazy(() => import("./components/Products"));
const Contact = lazy(() => import("./components/Contact"));

function App() {
  const { isMobile } = useDeviceDetect();

  return (
    <div className="app">
      <Header />

      <Suspense fallback={<Loading />}>
        <Hero />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <About />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <Services />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <Products />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <Contact />
      </Suspense>

      <Footer />
    </div>
  );
}

export default App;
```

### 10.4 モバイル最適化の効果測定

#### パフォーマンス測定用コード

```javascript
// utils/performanceMonitor.js
export const logCoreWebVitals = () => {
  if (typeof window !== "undefined" && "performance" in window) {
    // FCP (First Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        console.log(`FCP: ${entry.startTime}ms`);
      });
    }).observe({ type: "paint", buffered: true });

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`LCP: ${lastEntry.startTime}ms`);
    }).observe({ type: "largest-contentful-paint", buffered: true });

    // TBT (Total Blocking Time) - 間接的に計測
    let longTasksTotal = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        // 50ms以上のタスクのブロッキング時間を計算
        const blockingTime = entry.duration - 50;
        if (blockingTime > 0) {
          longTasksTotal += blockingTime;
          console.log(
            `長時間タスク: ${entry.duration}ms (ブロッキング時間: ${blockingTime}ms)`
          );
        }
      });
      console.log(`累積ブロッキング時間: ${longTasksTotal}ms`);
    }).observe({ type: "longtask", buffered: true });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log(`CLS更新: ${entry.value} (累積: ${clsValue})`);
        }
      });
    }).observe({ type: "layout-shift", buffered: true });
  }
};
```

#### 実装後の検証手順

1. **各ステップ完了後に Lighthouse 測定を実施**

   ```bash
   npx lighthouse https://www.orcx.co.jp --emulated-form-factor=mobile --throttling.cpuSlowdownMultiplier=4 --output=json --output-path=./lighthouse-mobile-after-step1.json
   ```

2. **実際のモバイルデバイスでのテスト**

   - 低〜中スペックの Android デバイス
   - iPhone デバイス（古い世代を含む）
   - スクロールの滑らかさを主観的に評価

3. **DevTools でのメモリプロファイリング**

   - Chrome DevTools の Memory タブを使用
   - ヒープスナップショットの比較（最適化前後）

4. **最終的なパフォーマンス指標の目標**

| 指標                 | 最適化前 | ステップ 1 後 | ステップ 2 後 | ステップ 3 後 | 目標値   |
| -------------------- | -------- | ------------- | ------------- | ------------- | -------- |
| パフォーマンススコア | 27       | 45            | 55            | 65+           | 60+      |
| TBT (ms)             | 12,780   | 2,500         | 1,000         | 500 以下      | 500 以下 |
| LCP (秒)             | 10.0     | 5.0           | 3.5           | 2.0 以下      | 2.5 以下 |
| FCP (秒)             | 5.7      | 3.5           | 2.5           | 1.8 以下      | 1.8 以下 |

### 10.5 最適化実装の注意点

1. **段階的な実装と検証**

   - 各ステップごとに検証を行う
   - 問題が発生した場合は早期に対処

2. **後方互換性の確保**

   - デスクトップ版の機能と見た目は維持
   - SEO への影響を最小限に抑える

3. **ユーザビリティの確保**

   - モバイル版でも全ての重要情報にアクセス可能に
   - タッチターゲットのサイズ適正化（44×44px 以上）

4. **コードの保守性**
   - デバイス分岐のロジックを集約
   - 将来の変更に対応しやすい構造設計
