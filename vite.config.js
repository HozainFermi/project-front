import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/service': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
      // /auth НЕ проксируем!
    }
  }
})