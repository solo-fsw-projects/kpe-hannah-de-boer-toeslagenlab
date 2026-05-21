import { defineConfig } from 'vite';
import { execSync } from 'child_process';

const version = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

export default defineConfig({
  build: {
    outDir: `dist/${version}`,
    emptyOutDir: false,
    lib: {
      entry: 'src/toeslagen.js',
      name: 'ToeslagenLib',
      formats: ['es'],
      fileName: () => 'toeslagen.js'
    },
    minify: false,
    rollupOptions: {
      output: {
        assetFileNames: '[name][extname]'
      }
    }
  },
  root: '.',
  publicDir: false,
  appType: 'mpa',
  server: {
    open: '/test-env/',
    fs: {
      strict: true,
    },
    host: true
  }
});
