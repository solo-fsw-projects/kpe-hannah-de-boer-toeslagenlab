import fs from 'fs';
import path from 'path';

const version = fs.readFileSync('VERSION', 'utf8').trim();
const distDir = path.join('dist', version);
const distUrl = `https://cdn.chrisdejager.nl/toeslagen/${version}`;

fs.mkdirSync(distDir, { recursive: true });

fs.copyFileSync('assets/pinpas.png', `${distDir}/pinpas.png`);
fs.copyFileSync('assets/toeslagen.css', `${distDir}/toeslagen.css`);

const header = fs.readFileSync('templates/base-header.html', 'utf8')
  .replace(/src=\".*?pinpas\.png\"/, `src="${distUrl}/pinpas.png"`)
  .replace(/src = '.*?toeslagen\.js'/, `src = '${distUrl}/toeslagen.js'`);

fs.writeFileSync(`dist/qualtrics-header-${version}.html`, header);
