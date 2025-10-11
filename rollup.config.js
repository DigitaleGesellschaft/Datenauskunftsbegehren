import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import html from '@rollup/plugin-html';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import styles from "rollup-plugin-styles";

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
    name: 'app',
    dir: 'public/',
    entryFileNames: production ? 'build/[name]-[hash].js' : 'build/[name].js',
    chunkFileNames: production ? 'build/[name]-[hash].js' : 'build/[name].js',
    assetFileNames: production ? 'build/[name]-[hash].[ext]' : 'build/[name].[ext]'
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      }
    }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
      exportConditions: ['svelte', 'browser']
    }),
    commonjs(),
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
    <link rel='icon' type='image/png' href='./favicon-32x32.png'>

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
<svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 531.14 121" style="enable-background:new 0 0 531.14 121;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#FFFFFF;}
	.st1{fill:#4EA93F;}
	.st2{fill:none;stroke:#000000;stroke-width:37.6366;stroke-miterlimit:10;}
</style>
<rect x="104.4" y="0.96" class="st1" width="51.02" height="51.02"/>
<g>
	<path d="M214.06,43.92c-2.88,4.68-8.64,8.06-16.63,8.06h-16.49V0.94h16.49c7.99,0,13.83,3.6,16.71,8.28
		c2.88,4.61,3.82,10.22,3.82,17.14C217.95,33.27,216.94,39.32,214.06,43.92z M204.84,12.17c-1.73-1.73-4.46-2.88-8.28-2.88h-6.34
		v34.35h6.34c4.03,0,6.77-1.22,8.5-3.1c2.95-3.24,3.46-8.57,3.46-14.18C208.51,20.59,207.94,15.34,204.84,12.17z"/>
	<path d="M227.16,44.28h10.87V8.64h-10.87V0.94h31.25v7.71h-10.95v35.64h10.95v7.71h-31.25V44.28z"/>
	<path d="M274.25,48.1c-5.69-5.54-6.41-13.46-6.41-21.6s1.08-15.62,6.7-21.24C278.28,1.51,283.32,0,288.5,0
		c12.96,0,18.58,8.57,18.58,17.14h-9.36c-0.14-4.18-2.38-8.79-9.22-8.79c-10.23,0-11.23,11.09-11.23,18.15
		c0,6.98,0.79,18.36,10.58,18.36c6.55,0,10.22-4.39,10.22-11.52h-12.02v-7.71h20.88v26.35h-6.05l-1.44-5.83
		c-1.15,2.81-5.18,6.84-12.31,6.84C282.46,53,277.85,51.63,274.25,48.1z"/>
	<path d="M316.44,44.28h10.87V8.64h-10.87V0.94h31.25v7.71h-10.95v35.64h10.95v7.71h-31.25V44.28z"/>
	<path d="M381.31,51.99h-9.22V9.58h-15.91V0.94h41.04v8.64h-15.91V51.99z"/>
	<path d="M430.06,39.32h-17.43l-3.67,12.67h-9.65l16.13-51.05h12.1l15.84,51.05h-9.65L430.06,39.32z M415.01,31.03h12.6l-6.26-21.67
		L415.01,31.03z"/>
	<path d="M451.29,0.94h9.29V43.2h24.77v8.79h-34.06V0.94z"/>
	<path d="M495.14,0.94h34.06v8.42h-24.77v12.03h19.66v8.35h-19.66v13.83h24.77v8.42h-34.06V0.94z"/>
	<path d="M6.41,116.1C0.72,110.56,0,102.63,0,94.5s1.08-15.62,6.7-21.24C10.44,69.51,15.48,68,20.67,68
		c12.96,0,18.58,8.57,18.58,17.14h-9.36c-0.14-4.18-2.38-8.79-9.22-8.79c-10.23,0-11.23,11.09-11.23,18.15
		c0,6.98,0.79,18.36,10.58,18.36c6.55,0,10.22-4.39,10.22-11.52H18.22v-7.71H39.1v26.35h-6.05l-1.44-5.83
		c-1.15,2.81-5.18,6.84-12.31,6.84C14.62,121,10.01,119.63,6.41,116.1z"/>
	<path d="M48.74,68.94H82.8v8.42H58.03v12.03h19.66v8.35H58.03v13.83H82.8v8.42H48.74V68.94z"/>
	<path d="M108.72,121c-9.36,0-19.51-5.54-19.51-17.35h9.5c0,6.62,5.04,9.36,10.15,9.36c5.04,0,10.22-2.09,10.22-7.56
		c0-3.6-2.95-5.54-6.62-6.19l-7.7-1.3c-8.64-1.51-14.19-5.98-14.19-14.11c0-9.14,8.14-15.91,18.36-15.91
		c10.66,0,18.43,6.84,18.58,16.06h-9.36c-0.22-4.61-3.38-8.14-9.36-8.14c-4.68,0-9.07,2.38-9.07,7.27c0,3.17,2.45,5.11,7.06,5.9
		l7.13,1.15c8.35,1.37,14.4,6.12,14.4,14.69C128.31,115.81,118.51,121,108.72,121z"/>
	<path d="M138.02,68.94h34.06v8.42h-24.77v12.03h19.66v8.35h-19.66v13.83h24.77v8.42h-34.06V68.94z"/>
	<path d="M183.46,68.94h9.29v42.27h24.77v8.79h-34.06V68.94z"/>
	<path d="M228.09,68.94h9.29v42.27h24.77v8.79h-34.06V68.94z"/>
	<path d="M287.28,121c-9.36,0-19.51-5.54-19.51-17.35h9.5c0,6.62,5.04,9.36,10.15,9.36c5.04,0,10.22-2.09,10.22-7.56
		c0-3.6-2.95-5.54-6.62-6.19l-7.7-1.3c-8.64-1.51-14.19-5.98-14.19-14.11c0-9.14,8.14-15.91,18.36-15.91
		c10.66,0,18.43,6.84,18.58,16.06h-9.36c-0.22-4.61-3.38-8.14-9.36-8.14c-4.68,0-9.07,2.38-9.07,7.27c0,3.17,2.45,5.11,7.06,5.9
		l7.13,1.15c8.35,1.37,14.4,6.12,14.4,14.69C306.87,115.81,297.07,121,287.28,121z"/>
	<path d="M343.15,102.63h9.29c-0.65,8.93-5.98,18.36-19.51,18.36c-5.18,0-10.01-1.51-13.75-5.26c-5.62-5.62-6.62-13.11-6.62-21.24
		s1.01-15.62,6.62-21.24c3.74-3.74,8.57-5.26,13.75-5.26c13.18,0,18.87,9.07,19.51,18h-9.36c-0.14-4.82-2.81-9.65-10.01-9.65
		c-2.88,0-5.4,1.01-7.42,3.02c-3.53,3.53-3.67,10.87-3.67,15.12s0.14,11.74,3.67,15.27c2.02,2.02,4.39,2.88,7.27,2.88
		C340.27,112.57,343.01,107.46,343.15,102.63z"/>
	<path d="M384.98,97.88h-16.56v22.11h-9.29V68.94h9.29v20.09h16.56V68.94h9.29v51.05h-9.29V97.88z"/>
	<path d="M430.06,107.32h-17.43l-3.67,12.67h-9.65l16.13-51.05h12.1l15.84,51.05h-9.65L430.06,107.32z M415.01,99.03h12.6
		l-6.26-21.67L415.01,99.03z"/>
	<path d="M459.86,91.04h22.11v8.42h-22.11v20.52h-9.29V68.94h34.92v8.42h-25.63V91.04z"/>
	<path d="M515.23,119.99h-9.22V77.58H490.1v-8.64h41.04v8.64h-15.91V119.99z"/>
</g>
<rect x="-261.27" y="-268.33" class="st2" width="1094.17" height="1853.86"/>
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
    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload({
      watch: 'public',
      // other livereload options
    }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};
