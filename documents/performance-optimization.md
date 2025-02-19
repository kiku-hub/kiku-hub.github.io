# パフォーマンス最適化要件定義

## 1. 現状分析

### 1.1 アセットサイズ

#### 3D モデル

- Animation_Formal_Bow_withSkin.glb: 9.9MB
- Animation_Skill_01_withSkin.glb: 3.2MB

#### 大型画像ファイル

- Datacenter.jpeg: 438KB → Datacenter.webp: 218KB (✅ 実装済)
- Teameng.jpeg: 364KB → Teameng.webp: 158KB (✅ 実装済)
- CompanyServices.jpeg: 215KB → CompanyServices.webp: 104KB (✅ 実装済)
- ITsolution.jpeg: 187KB → ITsolution.webp: 99KB (✅ 実装済)

### 1.2 現在の設定

- Cloudflare キャッシュレベル: スタンダード (✅ 実装済)
- ブラウザキャッシュ TTL: 1 年 (✅ 実装済)
- Content-Security-Policy: 設定済み (✅ 実装済)
- CORS 設定: `/orca/*.glb`に対して設定済み (✅ 実装済)

## 2. 最適化目標

### 2.1 ファイルサイズ削減目標

1. 3D モデル

   - Animation_Formal_Bow_withSkin.glb: 9.9MB → 4.47MB (55%削減) (⚠️ 最適化済だがデプロイ待ち)
   - Animation_Skill_01_withSkin.glb: 3.2MB → 2.63MB (17%削減) (⚠️ 最適化済だがデプロイ待ち)

2. 画像ファイル
   - すべての画像を WebP 形式に変換 (✅ 実装済)
   - JPEG/PNG → WebP で 40-50%の削減 (✅ 実装済)

### 2.2 読み込み時間目標

- 初期ページロード: 2 秒以内 (⚠️ 監視中)
- 3D モデル表示: 3 秒以内 (⚠️ 監視中)
- Time to Interactive (TTI): 3.5 秒以内 (⚠️ 監視中)

## 3. 最適化戦略

### 3.1 3D モデルの最適化

```bash
# 基本最適化
npx gltf-pipeline -i input.glb -o output.glb --draco.compressionLevel 10
```

### 3.2 画像の最適化

1. WebP 変換
2. 適切なサイズ設定
3. プログレッシブローディング実装

### 3.3 キャッシュ戦略

```toml
[[headers]]
for = "/orca/*.glb"
[headers.values]
Access-Control-Allow-Origin = "*"
Access-Control-Allow-Methods = "GET, OPTIONS"
Access-Control-Allow-Headers = "*"
Cache-Control = "public, max-age=31536000"
```

## 4. 実装手順

### 4.1 アセット最適化

1. 3D モデルの最適化

   - gltf-pipeline による圧縮
   - テクスチャの最適化

2. 画像の最適化
   - WebP 形式への変換
   - サイズ最適化

### 4.2 ローディング最適化

1. レイアウトシフト防止

   - CSS の先行読み込み
   - 適切なプレースホルダーの設定

2. 3D モデルのローディング
   - Suspense を使用した遅延読み込み
   - プログレッシブローディングの実装

### 4.3 キャッシュ設定

1. Cloudflare 設定

   - キャッシュレベル: スタンダード
   - ブラウザキャッシュ TTL: 1 年

2. ヘッダー設定
   - Content-Security-Policy
   - CORS 設定
   - キャッシュ制御

## 5. 監視と計測

### 5.1 パフォーマンス指標

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

### 5.2 監視ツール

- Cloudflare アナリティクス
- Google PageSpeed Insights
- Chrome DevTools Performance

## 6. 追加の最適化オプション（必要に応じて）

### 6.1 3D モデル

```javascript
// 高度な最適化オプション
npx gltf-pipeline -i input.glb -o output.glb \
  --draco.compressionLevel 10 \
  --draco.quantizePositionBits 14 \
  --draco.quantizeNormalBits 10 \
  --draco.quantizeTexcoordBits 12 \
  --draco.quantizeColorBits 8 \
  --draco.quantizeGenericBits 12
```

### 6.2 画像

```bash
# 高度なWebP圧縮
cwebp -q 75 -m 6 -af -f 50 -sharpness 0 -mt -v input.jpg -o output.webp
```

## 7. メンテナンス計画

### 7.1 定期的なチェック項目

- パフォーマンスメトリクスの監視
- キャッシュの有効性確認
- アセットサイズの監視
- エラーログの確認

### 7.2 更新手順

1. アセットの更新時

   - 最適化スクリプトの実行
   - キャッシュのパージ
   - パフォーマンスの確認

2. 設定の更新時
   - テスト環境での検証
   - 段階的なロールアウト
   - モニタリングの強化

## 8. 実装ステータスの凡例

- ✅ 実装済/運用中
- ⚠️ 実装済だが要確認/監視中
- ⏳ 未実装/予定
