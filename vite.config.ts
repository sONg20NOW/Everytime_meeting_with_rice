import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    build({
      entry: 'src/server.tsx' // 서버 엔트리 포인트 분리
    }),
    devServer({
      adapter,
      entry: 'src/server.tsx'
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html' // 클라이언트 엔트리 포인트
    }
  }
})