import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: false,
  },
  resolve: {
    alias: [
      {
        find: /^react-router$/,
        replacement: fileURLToPath(new URL('./node_modules/react-router/dist/development/index.js', import.meta.url)),
      },
      {
        find: /^react-router\/dom$/,
        replacement: fileURLToPath(new URL('./node_modules/react-router/dist/development/dom-export.js', import.meta.url)),
      },
    ],
  },
})
