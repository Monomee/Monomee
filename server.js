/**
 * Standalone Local & Production HTTP Server
 * Zero dependencies — Pure Node.js standard library.
 */

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const profileHandler = require("./api/profile");
const telemetryHandler = require("./api/telemetry");
const projectHandler = require("./api/project");
const skillsHandler = require("./api/skills");

const PORT = process.env.PORT || 3000;

function renderPreviewHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monomee // Terminal Profile HUD Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0c0c0c;
      color: #e8edf2;
      font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace;
      padding: 30px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      line-height: 1.5;
    }
    .hud-header {
      width: 100%;
      max-width: 860px;
      border: 1px solid #26313b;
      background: #11161c;
      padding: 14px 20px;
      border-radius: 6px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .hud-title {
      color: #00e5ff;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 1.5px;
    }
    .hud-status {
      color: #00ff9f;
      font-size: 12px;
      font-weight: 600;
    }
    .card-container {
      width: 100%;
      max-width: 860px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .card-wrap {
      border: 1px solid #1a2430;
      border-radius: 8px;
      overflow: hidden;
      background: #090d12;
      box-shadow: 0 8px 30px rgba(0, 229, 255, 0.03);
    }
    .card-label {
      padding: 6px 14px;
      font-size: 11px;
      color: #7d8995;
      background: #11161c;
      border-bottom: 1px solid #26313b;
      display: flex;
      justify-content: space-between;
    }
    .card-label a {
      color: #00e5ff;
      text-decoration: none;
    }
    .card-label a:hover {
      text-decoration: underline;
    }
    img {
      display: block;
      width: 100%;
      height: auto;
    }
    .endpoints-list {
      margin-top: 32px;
      width: 100%;
      max-width: 860px;
      background: #11161c;
      border: 1px solid #26313b;
      border-radius: 6px;
      padding: 16px 20px;
      font-size: 12px;
      color: #7d8995;
    }
    .endpoints-list h3 {
      color: #ffd166;
      margin-bottom: 8px;
      font-size: 13px;
    }
    .endpoints-list code {
      color: #00e5ff;
      background: #090d12;
      padding: 2px 6px;
      border-radius: 3px;
    }
    .endpoints-list ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 6px;
    }
  </style>
</head>
<body>
  <div class="hud-header">
    <div class="hud-title">⚡ MONOME // GITHUB PROFILE HUD SYSTEM</div>
    <div class="hud-status">● LOCAL_SERVER: ONLINE (PORT ${PORT})</div>
  </div>

  <div class="card-container">
    <div class="card-wrap">
      <div class="card-label">
        <span>01 // HERO PROFILE CARD</span>
        <a href="/api/profile" target="_blank">[ OPEN RAW SVG ↗ ]</a>
      </div>
      <img src="/api/profile" alt="Hero Profile Card" id="hero-img" />
    </div>

    <div class="card-wrap">
      <div class="card-label">
        <span>02 // GITHUB TELEMETRY CARD</span>
        <a href="/api/telemetry" target="_blank">[ OPEN RAW SVG ↗ ]</a>
      </div>
      <img src="/api/telemetry" alt="GitHub Telemetry Card" id="telemetry-img" />
    </div>

    <div class="card-wrap">
      <div class="card-label">
        <span>03 // FEATURED GAME PROJECT</span>
        <a href="/api/project" target="_blank">[ OPEN RAW SVG ↗ ]</a>
      </div>
      <img src="/api/project" alt="Featured Project Card" id="project-img" />
    </div>

    <div class="card-wrap">
      <div class="card-label">
        <span>04 // ARSENAL / TECH RACK</span>
        <a href="/api/skills" target="_blank">[ OPEN RAW SVG ↗ ]</a>
      </div>
      <img src="/api/skills" alt="Tech Rack Card" id="skills-img" />
    </div>
  </div>

  <div class="endpoints-list">
    <h3>AVAILABLE API ENDPOINTS:</h3>
    <ul>
      <li><code>GET /api/profile</code> — Dynamic Hero Profile Card SVG with telemetry & avatar</li>
      <li><code>GET /api/telemetry</code> (or <code>/api/stats</code>) — Dynamic GitHub Telemetry Card SVG</li>
      <li><code>GET /api/project</code> — Featured Release Card (Mixie Empire) SVG</li>
      <li><code>GET /api/skills</code> — Tech Stack & Arsenal SVG</li>
    </ul>
  </div>
</body>
</html>`;
}

// Adapts standard Node.js req/res to express/vercel style
function createServerResponseShim(res) {
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.send = function (body) {
    res.end(body);
    return res;
  };
  return res;
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = reqUrl.pathname;

  createServerResponseShim(res);

  try {
    if (pathname === "/" || pathname === "/index.html") {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(renderPreviewHtml());
      return;
    }

    if (pathname === "/api/profile") {
      await profileHandler(req, res);
      return;
    }

    if (pathname === "/api/telemetry" || pathname === "/api/stats") {
      await telemetryHandler(req, res);
      return;
    }

    if (pathname === "/api/project") {
      await projectHandler(req, res);
      return;
    }

    if (pathname === "/api/skills") {
      await skillsHandler(req, res);
      return;
    }

    // Serve static files from profile-assets if needed
    if (pathname.startsWith("/profile-assets/")) {
      const filePath = path.join(__dirname, pathname);
      if (fs.existsSync(filePath)) {
        res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }

    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("404 Not Found");
  } catch (err) {
    console.error("Server error:", err);
    res.statusCode = 500;
    res.end("500 Server Error");
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[Monome Profile Server] Running on http://localhost:${PORT}`);
    console.log(`Endpoints:`);
    console.log(`  http://localhost:${PORT}/api/profile`);
    console.log(`  http://localhost:${PORT}/api/telemetry`);
    console.log(`  http://localhost:${PORT}/api/project`);
    console.log(`  http://localhost:${PORT}/api/skills`);
  });
}

module.exports = server;
