import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  // Patch pour corriger l'erreur "global is not defined" (requis par sockjs-client)
  define: {
    global: 'window',
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },

  // Pré-bundler sockjs-client (CommonJS) pour que Vite le resolve correctement en ESM
  optimizeDeps: {
    include: ['sockjs-client'],
  },

  server: {
    port: 5173,
    proxy: {
      // API REST Spring Boot
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Endpoint WebSocket SockJS (doit matcher avant que le browser tente de se connecter)
      '/ws-notifications': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@reduxjs/toolkit') || id.includes('node_modules/react-redux')) {
            return 'redux-vendor';
          }
          if (id.includes('node_modules/@headlessui/react') || id.includes('node_modules/@heroicons/react')) {
            return 'ui-vendor';
          }
          if (id.includes('node_modules/recharts')) {
            return 'charts-vendor';
          }
          if (id.includes('node_modules/@stripe')) {
            return 'stripe-vendor';
          }
          if (id.includes('node_modules/formik') || id.includes('node_modules/yup')) {
            return 'forms-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor';
          }
          if (id.includes('node_modules/react-router-dom')) {
            return 'router-vendor';
          }
          if (id.includes('node_modules/axios') || id.includes('node_modules/react-toastify')) {
            return 'utils-vendor';
          }
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
  },
})
