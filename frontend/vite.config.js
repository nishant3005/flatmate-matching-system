import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth':        { target: 'http://localhost:8080', changeOrigin: true },
      '/preferences': { target: 'http://localhost:8080', changeOrigin: true },
      '/matches':     { target: 'http://localhost:8080', changeOrigin: true },
    }
  }
})
