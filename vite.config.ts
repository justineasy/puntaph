import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // node_modules (react, react-dom, router) into one long-lived
        // vendor chunk: app edits stop invalidating the framework cache.
        // Same bytes on first load, faster repeat loads — no runtime change.
        manualChunks(id: string) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
