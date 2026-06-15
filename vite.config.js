import { defineConfig } from 'vite';
import { execSync } from 'child_process';

const version = process.env.BUILD_VERSION ?? execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const majorVersion = (version.match(/^(v\d+)\./)?.[1] ?? version).replace(/\//g, '-');
const versionSafe = version.replace(/\//g, '-');

export default defineConfig({
  build: {
    outDir: `dist/${versionSafe}`,
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
