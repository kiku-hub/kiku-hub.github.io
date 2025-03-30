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
          'vendor': ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'swiper'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei']
        },
        format: 'es',
        generatedCode: {
          preset: 'es2015',
          constBindings: true
        }
      }
    },
    sourcemap: false,
    minify: 'esbuild',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 2000,
    emptyOutDir: true,
    copyPublicDir: true,
    reportCompressedSize: false,
    target: 'es2015'
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
      'framer-motion',
      'swiper'
    ],
    exclude: ['three', '@react-three/fiber', '@react-three/drei', '@google/model-viewer'],
    esbuildOptions: {
      target: 'es2015'
    }
  },
  esbuild: {
    target: 'es2015',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    legalComments: 'none'
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Service-Worker-Allowed': '/'
    }
  },
  preview: {
    port: 5174,
    host: true,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
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
