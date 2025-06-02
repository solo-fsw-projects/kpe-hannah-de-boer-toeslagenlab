import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const version = readFileSync('VERSION', 'utf-8').trim();

export default defineConfig({
  build: {
    outDir: `dist/${version}`,
    lib: {
      entry: resolve(__dirname, 'src/toeslagen.js'),
      name: 'ToeslagenLib',
      formats: ['iife'],
      fileName: () => 'toeslagen.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: '[name][extname]'
      }
    }
  },
  root: 'dev',
  publicDir: false,
  appType: 'mpa',
  server: {
    open: '/index.html',
    fs: {
      strict: true
    }
  }
});
