import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { imagetools } from 'vite-imagetools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imagetools({
      defaultDirectives: () => {
        return new URLSearchParams({
          format: 'webp',
          quality: '80',
          as: 'picture'
        });
      }
    })
  ],
  base: './',
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const { name } = assetInfo;
          const isSmallImage = name?.includes('/tech/');
          return isSmallImage 
            ? 'assets/images/[name].[hash][extname]'
            : 'assets/large-images/[name].[hash][extname]';
        }
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
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@google/model-viewer']
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
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
