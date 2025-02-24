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
