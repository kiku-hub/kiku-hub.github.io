import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

const MODELS_DIR = path.join(__dirname, '../public/orca');
const OUTPUT_DIR = path.join(__dirname, '../docs/orca');

function optimizeGlb(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    exec(`npx gltf-pipeline -i ${inputPath} -o ${outputPath} --draco.compressionLevel 10`, 
      { maxBuffer: 1024 * 1024 * 10 }, // 10MB buffer
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error optimizing ${inputPath}:`, error);
          reject(error);
          return;
        }
        if (stderr) {
          console.warn(`⚠️ Warning while optimizing ${inputPath}:`, stderr);
        }

        try {
          // ファイルサイズを比較
          const originalSize = fs.statSync(inputPath).size;
          const optimizedSize = fs.statSync(outputPath).size;
          const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
          
          console.log(`✅ Optimized ${path.basename(inputPath)}`);
          console.log(`   Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
          console.log(`   Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
          console.log(`   Saved: ${savings}%\n`);
          
          resolve(stdout);
        } catch (statError) {
          console.error(`❌ Error checking file sizes for ${inputPath}:`, statError);
          reject(statError);
        }
    });
  });
}

async function main() {
  try {
    // 出力ディレクトリが存在しない場合は作成
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = fs.readdirSync(MODELS_DIR)
      .filter(file => file.endsWith('.glb'));

    console.log('🚀 Starting GLB optimization...\n');

    // 順次処理に変更
    for (const file of files) {
      const inputPath = path.join(MODELS_DIR, file);
      const outputPath = path.join(OUTPUT_DIR, file);
      
      try {
        await optimizeGlb(inputPath, outputPath);
      } catch (error) {
        console.error(`Failed to optimize ${file}:`, error);
        // エラーが発生しても続行
        continue;
      }
    }

    console.log('✨ GLB optimization complete!');
  } catch (error) {
    console.error('❌ Fatal error during optimization:', error);
    process.exit(1);
  }
}

main(); 