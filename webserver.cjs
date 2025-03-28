const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const baseDirectory = __dirname;
const port = 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
};

http.createServer((request, response) => {
    try {
        const requestUrl = url.parse(request.url);
        let fsPath = path.join(baseDirectory, path.normalize(requestUrl.pathname));

        if (!fsPath.startsWith(baseDirectory)) {
            response.writeHead(403, { 'Content-Type': 'text/plain' });
            response.end('Access denied');
            return;
        }

        if (fs.existsSync(fsPath) && fs.statSync(fsPath).isDirectory()) {
            fsPath = path.join(fsPath, 'index.html');
        }

        const ext = path.extname(fsPath);
        const mimeType = mimeTypes[ext] || 'application/octet-stream';

        const fileStream = fs.createReadStream(fsPath);
        fileStream.pipe(response);

        fileStream.on('open', () => {
            response.writeHead(200, { 'Content-Type': mimeType });
        });

        fileStream.on('error', () => {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('File not found');
        });
    } catch (e) {
        response.writeHead(500, { 'Content-Type': 'text/plain' });
        response.end('Internal server error');
        console.error(e.stack);
    }
}).listen(port, () => {
    console.log(`Listening on port ${port}`);
});