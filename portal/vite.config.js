import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  worker: { format: 'es' },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split heavy vendors so first paint only downloads what the current page needs.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/three|@react-three/.test(id)) return 'vendor-3d';
          if (/recharts|d3-|victory/.test(id)) return 'vendor-charts';
          if (/framer-motion/.test(id)) return 'vendor-motion';
          if (/react-dom|react-router|scheduler|\/react\//.test(id)) return 'vendor-react';
          return undefined;
        },
      },
    },
  },
  server: {
    port: 5175,
    host: '0.0.0.0',
  },
});
