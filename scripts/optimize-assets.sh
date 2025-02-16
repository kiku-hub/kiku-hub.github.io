#!/bin/bash

# 必要なディレクトリを作成
mkdir -p src/assets/images/optimized
mkdir -p src/assets/icons/optimized

# JPEGファイルの最適化とWebP変換
for file in src/assets/images/*.{jpg,jpeg}; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    name="${filename%.*}"
    echo "Optimizing JPEG: $filename"
    
    # JPEG最適化
    convert "$file" -strip -quality 85 -resize "1920x1920>" "src/assets/images/optimized/$filename"
    
    # WebP変換
    convert "$file" -strip -quality 85 -resize "1920x1920>" "src/assets/images/optimized/$name.webp"
  fi
done

# PNGファイルの最適化とWebP変換
for file in src/assets/images/*.png; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    name="${filename%.*}"
    echo "Optimizing PNG: $filename"
    
    # PNG最適化
    convert "$file" -strip -quality 85 -resize "1920x1920>" "src/assets/images/optimized/$filename"
    
    # WebP変換（herobg.pngの場合は特別な処理）
    if [[ "$filename" == "herobg.png" ]]; then
      convert "$file" -strip -quality 75 -resize "2560x1440>" "src/assets/images/optimized/$name.webp"
    else
      convert "$file" -strip -quality 85 -resize "1920x1920>" "src/assets/images/optimized/$name.webp"
    fi
  fi
done

# SVGファイルの最適化
for file in src/assets/icons/*.svg; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo "Optimizing SVG: $filename"
    svgo -i "$file" -o "src/assets/icons/optimized/$filename"
  fi
done

# 最適化されたファイルを移動
mv src/assets/images/optimized/* src/assets/images/ 2>/dev/null || true
mv src/assets/icons/optimized/* src/assets/icons/ 2>/dev/null || true

# 一時ディレクトリの削除
rm -rf src/assets/images/optimized
rm -rf src/assets/icons/optimized

echo "Asset optimization completed!" 