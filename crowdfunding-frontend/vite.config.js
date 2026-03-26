import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
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
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React vendor
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Redux vendor
          if (id.includes('node_modules/@reduxjs/toolkit') || id.includes('node_modules/react-redux')) {
            return 'redux-vendor';
          }
          // UI Components
          if (id.includes('node_modules/@headlessui/react') || id.includes('node_modules/@heroicons/react')) {
            return 'ui-vendor';
          }
          // Heavy charts library - lazy load
          if (id.includes('node_modules/recharts')) {
            return 'charts-vendor';
          }
          // Payment library - lazy load
          if (id.includes('node_modules/@stripe')) {
            return 'stripe-vendor';
          }
          // Form validation - lazy load
          if (id.includes('node_modules/formik') || id.includes('node_modules/yup')) {
            return 'forms-vendor';
          }
          // Icons - lazy load
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor';
          }
          // Router
          if (id.includes('node_modules/react-router-dom')) {
            return 'router-vendor';
          }
          // Utilities
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

