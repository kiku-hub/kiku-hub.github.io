import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    emptyOutDir: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@google/model-viewer']
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173
  }
})
