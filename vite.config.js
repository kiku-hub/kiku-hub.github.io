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
          if (/\.(jpe?g|png|gif|webp)$/i.test(name ?? '')) {
            return 'assets/images/[name].[hash][extname]'
          }
          if (/\.svg$/i.test(name ?? '')) {
            return 'assets/icons/[name].[hash][extname]'
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
    assetsInlineLimit: 0,
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
    port: 5174,
    host: true
  },
  assetsInclude: [
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.png',
    '**/*.gif',
    '**/*.svg',
    '**/*.webp'
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
