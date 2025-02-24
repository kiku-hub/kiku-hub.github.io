import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    cssCodeSplit: false,
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
        },
        manualChunks: {
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'react': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion'],
          'swiper': ['swiper'],
          'utils': ['maath']
        }
      }
    },
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
        ecma: 2020
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false,
        ecma: 2020
      }
    },
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 2000,
    emptyOutDir: true,
    copyPublicDir: true,
    reportCompressedSize: false,
    target: 'es2020'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'three', 
      '@react-three/fiber', 
      '@react-three/drei',
      'framer-motion',
      'swiper'
    ],
    exclude: ['@google/model-viewer'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  esbuild: {
    target: 'es2020',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Service-Worker-Allowed': '/'
    }
  },
  preview: {
    port: 5174,
    host: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'Service-Worker-Allowed': '/'
    }
  },
  assetsInclude: [
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.png',
    '**/*.gif',
    '**/*.svg',
    '**/*.webp'
  ],
  publicDir: 'public'
})
