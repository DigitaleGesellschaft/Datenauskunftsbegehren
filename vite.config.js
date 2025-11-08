import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';
import path from 'path';

const htmlVars = {
  browser_lang: 'de',
  page_title: 'Generiere dein Datenauskunftsbegehren | Digitale Gesellschaft',
  description: 'Gemäss Datenschutzgesetz hat jede Person das Recht zu erfahren, welche Daten über sie gespeichert sind, und diese – wenn nötig – löschen oder korrigieren zu lassen.',
  description_short: 'Gemäss Datenschutzgesetz hat jede Person das Recht zu erfahren, welche Daten über sie gespeichert sind',
  browser_outdated: '<p>Du verwendest einen alten Browser.<br>Der Generator funktioniert damit leider nicht.</p><p>Bitte verwende eine aktuelle Version des Browsers deiner Wahl.</p>'
};

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'html-template-vars',
      transformIndexHtml(html) {
        // einfache Platzhalter-Ersetzung: %varname%
        return html.replace(/%(\w+)%/g, (_, key) => htmlVars[key] ?? '');
      }
    }
  ],
  server: {
    open: true
  },
  preview: {
    open: true,
    port: 8080,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  base: './',
});

