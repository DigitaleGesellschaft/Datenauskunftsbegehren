import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import html from '@rollup/plugin-html';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import styles from "rollup-plugin-styles";
import fs from 'fs'

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'esm',
    name: 'app',
    dir: 'public/',
    entryFileNames: production ? 'build/[name]-[hash].js' : 'build/[name].js',
    chunkFileNames: production ? 'build/[name]-[hash].js' : 'build/[name].js',
    assetFileNames: production ? 'build/[name]-[hash].[ext]' : 'build/[name].[ext]'
  },
  plugins: [
    commonjs(),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        format: 'esm'
      }
    }),
    styles({
      mode: ["extract", "styles.css"],
      minimize: true,
      sourceMap: true
    }),

    html({
      fileName: 'index.html',
      template({ attributes, bundle, files, publicPath, title }) {
        const links = files.css
          .map(file => {
            return `<link rel='stylesheet' href='./${file.fileName}'>`
          })

        const modules = files.js
          .filter(file => file.isEntry)
          .map(file => {
            return `<script type="module" defer src='./${file.fileName}'></script>`
          })

        return `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <meta name="description" content="Gemäss Datenschutzgesetz hat jede Person das Recht zu erfahren, welche Daten über sie gespeichert sind, und diese – wenn nötig – löschen oder korrigieren zu lassen.">
    <title>Generiere dein Datenauskunftsbegehren | Digitale Gesellschaft</title>
    <link rel='icon' type='image/png' href='./favicon.png'>

    ${links}
    ${modules}

    <style>
      #loader path {
        fill: white;
      }
      .nomodule-message {
        position: absolute;
        top: 40px;
        color: white;
        max-width: 700px;
        left: 50%;
        transform: translateX(-50%);
      }
    </style>
  
    <meta property="og:image" content="https://www.digitale-gesellschaft.ch/auskunftsbegehren/datenauskunftsbegehren-og.png">
    <meta property="og:title" content="Generiere dein Datenauskunftsbegehren">
    <meta property="og:description" content="Gemäss Datenschutzgesetz hat jede Person das Recht zu erfahren, welche Daten über sie gespeichert sind.">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@digiges_ch" />
    <meta name="twitter:creator" content="@digiges_ch" />
    <meta name="twitter:title" content="Generiere dein Datenauskunftsbegehren" />
    <meta name="twitter:description" content="Gemäss Datenschutzgesetz hat jede Person das Recht zu erfahren, welche Daten über sie gespeichert sind." />
    <meta name="twitter:image" content="https://www.digitale-gesellschaft.ch/auskunftsbegehren/datenauskunftsbegehren-twitter.png" />

    <link rel="preload" href="./fonts/Montserrat/latin-300.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="./fonts/Montserrat/latin-700.woff2" as="font" type="font/woff2" crossorigin>
  </head>
  <body>
    <div id="loader">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 63.1 63.1">
        <path d="M30 63.1h-.03c-1.54 0-3.1-.091-4.62-.272l1.93-16.2c.887.106 1.79.159 2.69.159l.208.002-.178 6.96z"/>
        <path d="M23.7 57.8c-1.3-.295-2.6-.66-3.87-1.09l5.24-15.5c.729.247 1.48.459 2.23.629zM39 58.5l-5.81-15.3c.718-.273 1.43-.589 2.12-.936l7.37 14.6c-1.19.6-2.43 1.15-3.67 1.62"/>
        <path d="M16.6 58.4a39.852 39.852 0 01-3.56-1.86l8.33-14.1c.663.392 1.35.755 2.05 1.08z"/>
        <path d="M47.1 60.1l-8.84-13.8c.648-.418 1.28-.872 1.89-1.35l10.2 12.8c-1.04.831-2.14 1.62-3.26 2.34"/>
        <path d="M50.7 54.3L39.2 42.6a24.57 24.57 0 001.82-2.01l12.8 10.2a39.21 39.21 0 01-3.13 3.47M6.1 50.1c-.971-1.21-1.88-2.5-2.7-3.82l13.9-8.61c.475.764 1 1.51 1.56 2.21z"/>
        <path d="M5.7 42.6c-.583-1.2-1.11-2.44-1.56-3.7l15.4-5.56c.262.723.565 1.44.9 2.13z"/>
        <path d="M61.9 43.2l-15.6-5c.233-.73.433-1.48.589-2.23l16 3.34a37.859 37.859 0 01-1.03 3.89M1.9 36.9a39.135 39.135 0 01-.762-3.94l16.2-2.27c.108.766.254 1.53.439 2.28z"/>
        <path d="M59.7 36.3l-16.3-1.67c.078-.768.118-1.55.118-2.33l16.3-.177v.234c0 1.27-.069 2.62-.206 3.94"/>
        <path d="M46.8 31.3a22.68 22.68 0 00-.451-2.67l15.9-3.68c.351 1.52.613 3.07.778 4.62zM15.9 27.4L0 23.81a39.41 39.41 0 011.3-4.5l15.4 5.5c-.301.848-.556 1.72-.751 2.6"/>
        <path d="M21 26L6.3 18.93c.578-1.2 1.22-2.39 1.92-3.52l13.9 8.56c-.402.654-.777 1.34-1.11 2.04"/>
        <path d="M42.4 25.9a22.883 22.883 0 00-1.39-1.86l12.6-10.5c.854 1.03 1.66 2.1 2.4 3.21zM20.2 22l-13-9.95C8.009 10.99 8.88 9.97 9.8 9l11.9 11.2c-.53.561-1.04 1.16-1.51 1.77"/>
        <path d="M43.8 20.5a22.299 22.299 0 00-1.75-1.54l10.2-12.8a38.86 38.86 0 013 2.65z"/>
        <path d="M40 20.3c-.76-.485-1.55-.926-2.36-1.32l7.05-14.7a41.4 41.4 0 014.1 2.27z"/>
        <path d="M24.3 16.5L17.16 1.8c1.4-.681 2.86-1.28 4.33-1.79l5.31 15.5c-.848.291-1.69.638-2.5 1.03"/>
        <path d="M28.8 19.8L25.13 3.9c1.3-.298 2.63-.532 3.95-.695l2 16.2c-.765.094-1.54.23-2.28.401"/>
        <path d="M34 16.7a22.971 22.971 0 00-2.33-.071l-.327-16.3a39.68 39.68 0 014 .125z"/>
      </svg>
    </div>
    <div class="nomodule-message" style="display: none;">
      <p>Du verwendest einen alten Browser. <br>Der Generator funktioniert damit leider nicht.</p>
      <p>Bitte verwende eine aktuelle Version des Browsers deiner Wahl.</p>
    </div>
    <script nomodule>
      document.querySelector('.nomodule-message').setAttribute('style', 'display: block;')
    </script>
  </body>
</html>`
      }
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    // commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload({
      watch: 'public',
      // other livereload options
      https: {
        key: fs.readFileSync('local.key'),
        cert: fs.readFileSync('local.cert')
      }
    }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
