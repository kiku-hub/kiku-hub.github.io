# パフォーマンス最適化要件定義

## 1. 現状分析

### 1.1 アセットサイズ

#### 3D モデル

- Animation_Formal_Bow_withSkin.glb: 9.9MB → 751KB (83%削減) ✅

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

### 1.3 サイズ確認コマンド

#### 本番環境のファイルサイズ確認

```bash
# 3Dモデルのサイズ確認
curl -sL https://www.orcx.co.jp/orca/Animation_Formal_Bow_withSkin.glb -o temp1.glb && ls -lh temp1.glb && rm temp1.glb

# キャッシュ状態の確認
curl -sI https://www.orcx.co.jp/orca/Animation_Formal_Bow_withSkin.glb | grep -i 'cf-cache-status\|content-length\|last-modified'

# WebP画像のサイズ確認
curl -sL https://www.orcx.co.jp/assets/images/Datacenter.webp -o temp.webp && ls -lh temp.webp && rm temp.webp
```

#### ローカル環境のファイルサイズ確認

```bash
# docs/orcaディレクトリのサイズ確認
ls -lh docs/orca/*.glb

# 最適化前後のサイズ比較
ls -lh public/orca/*.glb
ls -lh docs/orca/*.glb

# ディレクトリ全体のサイズ確認
du -sh docs/orca
du -sh docs/assets/images
```

#### ビルド後のアセットサイズ確認

```bash
# ビルド後の全アセットサイズ
find docs -type f -exec ls -lh {} \;

# 拡張子別の合計サイズ
find docs -type f -name "*.glb" -exec ls -lh {} \; | awk '{ total += $5 } END { print "Total GLB size: " total/1024/1024 "MB" }'
find docs -type f -name "*.webp" -exec ls -lh {} \; | awk '{ total += $5 } END { print "Total WebP size: " total/1024/1024 "MB" }'
find docs -type f -name "*.js" -exec ls -lh {} \; | awk '{ total += $5 } END { print "Total JS size: " total/1024/1024 "MB" }'
```

#### デプロイ後の確認コマンド

```bash
# Cloudflareのキャッシュ状態確認
for file in $(curl -s https://www.orcx.co.jp | grep -o 'src="[^"]*"' | cut -d'"' -f2); do
  echo "Checking $file"
  curl -sI "https://www.orcx.co.jp$file" | grep -i 'cf-cache-status\|content-length'
done

# 圧縮状態の確認
curl -sI -H "Accept-Encoding: gzip, deflate, br" https://www.orcx.co.jp/orca/Animation_Formal_Bow_withSkin.glb | grep -i 'content-encoding\|content-length'
```

## 2. 最適化目標

### 2.1 ファイルサイズ削減目標

1. 3D モデル

   - Animation_Formal_Bow_withSkin.glb: 9.9MB → 751KB (83%削減) ✅
   - 当初目標の 55%削減を大きく上回る結果を達成

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
// 基本的な最適化（Draco圧縮）
npx gltf-pipeline -i input.glb -o output.glb \
  --draco.compressionLevel 10 \
  --draco.quantizePositionBits 14 \
  --draco.quantizeNormalBits 10 \
  --draco.quantizeTexcoordBits 12 \
  --draco.quantizeColorBits 8 \
  --draco.quantizeGenericBits 12

// 高度な最適化（gltfjsx）
npx gltfjsx input.glb --transform --simplify --simplify-precision 0.25
```

#### 最適化結果（2024 年 2 月 23 日更新）

1. Animation_Formal_Bow_withSkin.glb

   - 初期サイズ: 9.9MB
   - 中間最適化: 4.47MB (55%削減)
   - 最終サイズ: 751KB (83%削減)
   - 使用ツール: gltfjsx
   - 最適化オプション:
     - `--transform`: モデルの変換と最適化
     - `--simplify`: ジオメトリの単純化
     - `--simplify-precision 0.25`: 精度を 25%に設定
   - 結果: 当初目標（55%削減）を大きく上回る最適化を達成

2. 最適化の効果

   - ロード時間の大幅な改善
   - ネットワーク帯域の効率的な使用
   - モバイルデバイスでのパフォーマンス向上

3. 品質管理
   - 視覚的な品質を維持
   - アニメーションの滑らかさを保持
   - ブラウザ互換性の確保

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
