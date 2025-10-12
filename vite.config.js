import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { createHtmlPlugin } from 'vite-plugin-html';


export default defineConfig({
  plugins: [
    // commonjs(),
    svelte(),
    createHtmlPlugin({
      minify: true,
      entry: 'src/main.js',
      template: 'index.html',
      inject: {
        data: {
        },
      },
    })
  ],

  server: {
    open: true
  },
  prewiew: {
    open: true,
    port: 8080,
  },
  optimizeDeps: {
    include: ['lodash-es'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'build/[name]-[hash].js',
        chunkFileNames: 'build/[name]-[hash].js',
        assetFileNames: 'build/[name]-[hash].[ext]',
      },
      sourcemap: true,
      name: 'app',
    },
  },
  base: './',
});


