import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // ⚠️ ESSENCIAL: Definir diretórios explicitamente
  root: path.resolve(__dirname),  // Raiz do projeto
  publicDir: path.resolve(__dirname, 'public'),  // Onde está index.html
  base: '/',
  
  server: {
    port: 5173,
    host: true,           // ⚠️ CRÍTICO: permite acesso externo
    strictPort: true,     // Não muda de porta
    open: false,
    cors: true,
    
    // ⚠️ CONFIGURAÇÃO ESPECIAL PARA CODESPACES:
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      timeout: 30000
    },
    
    // Headers
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    }
  },
  
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  // Logs detalhados
  logLevel: 'info'
})
