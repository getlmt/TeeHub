import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // --- ADD THIS SECTION ---
  server: {
    proxy: {
      // Forward requests starting with /api to the backend
      '/api': {
        target: 'http://localhost:8080', // Your backend server address
        changeOrigin: true, // Recommended for virtual hosted sites
        // No rewrite needed if backend endpoints start with /api
      },
      // Forward requests starting with /auth to the backend
      '/auth': {
        target: 'http://localhost:8080', // Your backend server address
        changeOrigin: true,
        // No rewrite needed if backend endpoints start with /auth
      }
    }
  }
  // --- END OF ADDED SECTION ---
})
