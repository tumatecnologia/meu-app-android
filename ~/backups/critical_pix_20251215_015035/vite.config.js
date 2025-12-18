import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/meu-app-android/', // IMPORTANTE para GitHub Pages
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5174,
    host: true
  }
})
