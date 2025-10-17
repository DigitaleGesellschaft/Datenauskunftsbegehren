import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    open: true
  },
  preview: {
    open: true,
    port: 8080,
  },
  optimizeDeps: {
    include: ['lodash-es'],
  },
})
