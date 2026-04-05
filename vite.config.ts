import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
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
  }
})
