/* eslint-disable @typescript-eslint/no-require-imports */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const { createServer } = require('http');
const next = require('next');

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || '0.0.0.0';
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`MAS Marine Admin ready on http://${hostname}:${port}`);
  });
});
