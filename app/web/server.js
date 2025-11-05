const http = require('http');
const port = process.env.PORT || 8080;
const server = http.createServer((_, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ ok:true, app:"M&Music", msg:"Hello from Alpine non-root!" }));
});
server.listen(port, () => console.log(`web up on ${port}`));
