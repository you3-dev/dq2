import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages用: リポジトリ名をベースパスに設定
  // 環境変数 GITHUB_REPOSITORY から自動取得、なければルート
  base: process.env.GITHUB_ACTIONS
    ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || ''}/`
    : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
})
