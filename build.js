import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const version = process.env.BUILD_VERSION ?? execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const versionSafe = version.replace(/\//g, '-');
const distDir = path.join('dist', version);
const distUrl = `https://solo-fsw-projects.github.io/kpe-hannah-de-boer-toeslagenlab/${version}`;

fs.mkdirSync(distDir, { recursive: true });

fs.copyFileSync('assets/pinpas.png', `${distDir}/pinpas.png`);
fs.copyFileSync('assets/toeslagen.css', `${distDir}/toeslagen.css`);

const header = fs.readFileSync('templates/base-header.html', 'utf8')
  .replace(/src=\".*?pinpas\.png\"/, `src="${distUrl}/pinpas.png"`)
  .replace(/src = '.*?toeslagen\.js'/, `src = '${distUrl}/toeslagen.js'`);

fs.writeFileSync(`dist/qualtrics-header-${versionSafe}.html`, header);
