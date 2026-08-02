import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        landing: 'index.html',
        playground: 'playground.html',
      },
    },
  },
})
