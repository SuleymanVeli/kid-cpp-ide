import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()],
    // Monaco Editor üçün bu hissəni əlavə et:
    optimizeDeps: {
      include: ['monaco-editor/esm/vs/editor/editor.worker']
    }
  },
})