import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(glb|gltf)$/.test(name ?? '')) {
            return 'assets/models/[name].[hash][extname]'
          }
          if (/\.(mp4|webm|ogg)$/.test(name ?? '')) {
            return 'assets/videos/[name].[hash][extname]'
          }
          return 'assets/[name].[hash][extname]'
        }
      }
    },
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: true,
    emptyOutDir: true,
    copyPublicDir: true,
    reportCompressedSize: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three'],
    exclude: ['@google/model-viewer']
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173
  },
  preview: {
    port: 5173,
    host: true
  },
  assetsInclude: [
    '**/*.glb',
    '**/*.gltf',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.mp4',
    '**/*.webm',
    '**/*.ogg'
  ],
  publicDir: 'public',
  experimental: {
    renderBuiltUrl(filename, { hostType, type, hostId }) {
      if (type === 'asset' && filename.endsWith('?base64')) {
        const path = filename.replace('?base64', '');
        return `data:image/png;base64,${Buffer.from(path).toString('base64')}`;
      }
      return filename;
    }
  }
})
