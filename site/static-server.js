const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const types = { ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };

http.createServer((request, response) => {
  const requested = request.url === "/" ? "index.html" : decodeURIComponent(request.url.split("?")[0]).replace(/^\//, "");
  const file = path.resolve(root, requested);
  if (!file.startsWith(root)) return response.writeHead(403).end("Forbidden");
  fs.readFile(file, (error, data) => {
    if (error) return response.writeHead(404).end("Not found");
    response.writeHead(200, { "Content-Type": `${types[path.extname(file)] || "application/octet-stream"}; charset=utf-8` });
    response.end(data);
  });
}).listen(4173, () => console.log("MASQANI preview: http://localhost:4173"));
