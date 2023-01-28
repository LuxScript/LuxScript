const http = require('http');
const fs = require('fs');
const open = require('open');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

var filename = 'creators.txt';
var port = '3000';

const server = http.createServer((req, res) => {
  const filePath = './SmokeScript/src/creators.txt';
  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': stat.size,
    'Content-Disposition': `attachment; filename="${filename}"`
  });
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

server.listen(port);
console.log('Successfully opened the web browser and the local server.');
open('http://localhost:' + port, {wait: true});