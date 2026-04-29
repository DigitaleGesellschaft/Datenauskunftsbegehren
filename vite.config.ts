import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

let gitRevision = process.env.GIT_REVISION || 'unknown'
if (gitRevision === 'unknown') {
  try {
    gitRevision = execSync('git rev-parse --short HEAD').toString().trim()
  } catch { /* not a git repo or git not available */ }
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __GIT_REVISION__: JSON.stringify(gitRevision),
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
