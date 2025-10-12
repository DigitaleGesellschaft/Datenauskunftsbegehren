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
          // @TODO Redaktion description_short: Shorten description for SEO purposes or leave the long version?
          browser_lang: 'de',
          page_title: 'Generiere dein Datenauskunftsbegehren | Digitale Gesellschaft',
          description: 'Gemäss Datenschutzgesetz hat jede Person das Recht zu erfahren, welche Daten über sie gespeichert sind, und diese – wenn nötig – löschen oder korrigieren zu lassen.',
          description_short: 'Gemäss Datenschutzgesetz hat jede Person das Recht zu erfahren, welche Daten über sie gespeichert sind',
          browser_outdated: '<p>Du verwendest einen alten Browser. <br>Der Generator funktioniert damit leider nicht.</p><p>Bitte verwende eine aktuelle Version des Browsers deiner Wahl.</p>'
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


