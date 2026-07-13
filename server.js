// OG-og — 貼網址 → 抓 OG 資料 → 套九種模板挑一張 → 匯出 1200×630 PNG
// 零依賴 http server;截圖引擎用 playwright-core 驅動系統 Edge/Chrome(不下載瀏覽器)。
const http = require("http");
const fs = require("fs");
const path = require("path");
const { TEMPLATES } = require("./public/templates.js");

const PORT = process.env.PORT || 5610;
const PUB = path.join(__dirname, "public");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) og-studio/0.1";

// ── OG 資料抓取:抓頁面 HTML,解析 meta / title / icon ──
async function fetchOgData(pageUrl) {
  const res = await fetch(pageUrl, { headers: { "user-agent": UA, accept: "text/html" }, redirect: "follow" });
  const html = (await res.text()).slice(0, 500_000);
  const base = res.url || pageUrl;

  const metas = {};
  for (const tag of html.match(/<meta\s[^>]+>/gi) || []) {
    const key = (tag.match(/(?:property|name)\s*=\s*["']([^"']+)["']/i) || [])[1];
    const content = (tag.match(/content\s*=\s*["']([^"']*)["']/i) || [])[1];
    if (key && content && !(key in metas)) metas[key.toLowerCase()] = content;
  }
  const titleTag = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "";
  const icon = (html.match(/<link\s[^>]*rel=["'](?:shortcut )?(?:icon|apple-touch-icon)["'][^>]*>/i) || [""])[0];
  const iconHref = (icon.match(/href\s*=\s*["']([^"']+)["']/i) || [])[1];

  const abs = (u) => { try { return u ? new URL(u, base).href : ""; } catch { return ""; } };
  const host = new URL(base).hostname;
  const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

  // og:image 缺席時,撿頁面內文第一張像樣的圖(跳過 svg/icon/追蹤像素)
  const contentImg = () => {
    for (const tag of html.match(/<img\s[^>]+>/gi) || []) {
      const src = (tag.match(/src\s*=\s*["']([^"']+)["']/i) || [])[1] || "";
      if (!src || src.startsWith("data:") || /\.svg|favicon|logo|icon|pixel|avatar/i.test(src)) continue;
      return abs(src);
    }
    return "";
  };

  return {
    site: decode(metas["og:site_name"] || host),
    title: decode(metas["og:title"] || titleTag.trim() || host),
    desc: decode(metas["og:description"] || metas["description"] || ""),
    image: abs(metas["og:image"] || metas["twitter:image"]) || contentImg(),
    logo: abs(iconHref) || `https://www.google.com/s2/favicons?domain=${host}&sz=128`,
    color: metas["theme-color"] || "#6d5ce7",
  };
}

// ── /preview:server 端直接組出 1200×630 的完整頁(預覽 iframe 與截圖共用同一份渲染)──
function renderPreview(t, data) {
  const tpl = TEMPLATES.find((x) => x.id === t) || TEMPLATES[0];
  return `<!doctype html><meta charset="utf-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{width:1200px;height:630px;overflow:hidden}</style>${tpl.render(data)}`;
}

const parseData = (q) => {
  try { return JSON.parse(Buffer.from(decodeURIComponent(q), "base64").toString("utf8")); }
  catch { return { site: "og-studio", title: "資料解析失敗", desc: "", image: "", logo: "", color: "#6d5ce7" }; }
};

// ── 匯出:playwright-core + 系統 Edge/Chrome 截圖 ──
let browserPromise = null;
async function getBrowser() {
  if (!browserPromise) {
    const { chromium } = require("playwright-core");
    browserPromise = chromium.launch({ channel: "msedge" }).catch(() => chromium.launch({ channel: "chrome" }));
  }
  return browserPromise;
}

async function exportPng(t, d) {
  const browser = await getBrowser();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  try {
    await page.goto(`http://localhost:${PORT}/preview?t=${t}&d=${encodeURIComponent(d)}`, { waitUntil: "networkidle", timeout: 15000 });
    return await page.screenshot({ type: "png" });
  } finally {
    await page.close();
  }
}

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".svg": "image/svg+xml" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname === "/api/og") {
      const data = await fetchOgData(url.searchParams.get("url"));
      res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify(data));
    }
    if (url.pathname === "/preview") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      return res.end(renderPreview(url.searchParams.get("t"), parseData(url.searchParams.get("d") || "")));
    }
    if (url.pathname === "/api/export") {
      const png = await exportPng(url.searchParams.get("t"), url.searchParams.get("d") || "");
      res.writeHead(200, { "content-type": "image/png", "content-disposition": `attachment; filename="og-${url.searchParams.get("t")}.png"` });
      return res.end(png);
    }
    const file = path.join(PUB, url.pathname === "/" ? "index.html" : url.pathname);
    if (file.startsWith(PUB) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
      return res.end(fs.readFileSync(file));
    }
    res.writeHead(404); res.end("not found");
  } catch (e) {
    console.error(`[OG-og] ${url.pathname} 失敗:`, e.message);
    res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: e.message }));
  }
}).listen(PORT, () => console.log(`og-studio → http://localhost:${PORT}`));
