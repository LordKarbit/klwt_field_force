import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');
          if (!normalizedId.includes('/node_modules/')) return undefined;
          if (normalizedId.includes('/@mui/icons-material/')) return 'vendor-mui-icons';
          if (
            normalizedId.includes('/@mui/material/') ||
            normalizedId.includes('/@mui/system/') ||
            normalizedId.includes('/@emotion/')
          ) {
            return 'vendor-mui';
          }
          if (
            normalizedId.includes('/react/') ||
            normalizedId.includes('/react-dom/') ||
            normalizedId.includes('/scheduler/')
          ) {
            return 'vendor-react';
          }
          return 'vendor';
        },
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 3010,
    strictPort: true,
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3005',
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: ['.trycloudflare.com'],
  },
});
