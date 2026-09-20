import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Frontend dev server on 5173; API calls to /api are proxied to the Express
// backend on 5000 so there are no CORS surprises during local development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
