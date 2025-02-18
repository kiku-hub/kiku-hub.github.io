const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

const MODELS_DIR = path.join(__dirname, '../public/orca');
const OUTPUT_DIR = path.join(__dirname, '../docs/orca');

async function optimizeGlb(inputPath, outputPath) {
  try {
    // gltf-pipelineを使用してGLBファイルを最適化
    await execAsync(`npx gltf-pipeline -i "${inputPath}" -o "${outputPath}" --draco.compressionLevel 10`);
    
    // ファイルサイズを比較
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    
    console.log(`✅ Optimized ${path.basename(inputPath)}`);
    console.log(`   Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Saved: ${savings}%\n`);
  } catch (error) {
    console.error(`❌ Error optimizing ${path.basename(inputPath)}:`, error.message);
  }
}

async function main() {
  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // GLBファイルを検索して最適化
  const files = fs.readdirSync(MODELS_DIR).filter(file => file.endsWith('.glb'));
  
  console.log('🚀 Starting GLB optimization...\n');
  
  for (const file of files) {
    const inputPath = path.join(MODELS_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);
    await optimizeGlb(inputPath, outputPath);
  }
  
  console.log('✨ GLB optimization complete!');
}

main().catch(console.error); 