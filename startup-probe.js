const { createServer } = require('http');

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || '0.0.0.0';

createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end(`MAS Marine startup probe is running\nurl=${req.url}\n`);
}).listen(port, hostname, () => {
  console.log(`MAS Marine startup probe ready on http://${hostname}:${port}`);
});
