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

        return ``
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
