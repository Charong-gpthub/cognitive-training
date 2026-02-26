const fs = require("fs");
const http = require("http");
const path = require("path");

const port = process.env.PORT || 3000;
const rootDir = __dirname;

const MIME_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml; charset=utf-8"
};

function resolveFilePath(urlPath) {
    const safePath = decodeURIComponent((urlPath || "/").split("?")[0]);
    const candidate = safePath.replace(/^\/+/, "");
    const requested = candidate === "" ? "index.html" : candidate;
    const normalizedPath = path.normalize(requested).replace(/^(\.\.[\\/])+/, "");
    return path.join(rootDir, normalizedPath);
}

const server = http.createServer((req, res) => {
    const filePath = resolveFilePath(req.url || "/");

    fs.stat(filePath, (statError, stat) => {
        if (statError || !stat.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not Found");
            return;
        }

        const extension = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[extension] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": contentType });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(port, () => {
    console.log(`Cognitive Training Hub running at http://localhost:${port}`);
});
