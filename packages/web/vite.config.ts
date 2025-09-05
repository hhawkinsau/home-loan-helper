import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'react-vendor': ['react', 'react-dom'],
          'chakra-vendor': ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          'chart-vendor': ['recharts'],
          'form-vendor': ['react-hook-form', 'zod'],
          'icon-vendor': ['react-icons'],
          'animation-vendor': ['framer-motion'],
        },
      },
    },
  },
})
