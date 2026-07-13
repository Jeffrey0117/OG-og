// og-studio 模板庫 — 每個模板 = { id, name, note, render(data) → 1200×630 的 HTML }
// data: { site, title, desc, image, logo, color }
// 瀏覽器(預覽 UI)與 server(/preview 出圖)共用這一份。

// 只能用單引號 — 這串會進 style="…" 的雙引號屬性,雙引號會把屬性提前終結
const FONT = `'Noto Sans TC','Microsoft JhengHei','PingFang TC',sans-serif`;

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const clamp = (s = "", n) => (String(s).length > n ? String(s).slice(0, n - 1) + "…" : String(s));

const logoImg = (d, size = 44) =>
  d.logo
    ? `<img src="${esc(d.logo)}" style="width:${size}px;height:${size}px;border-radius:10px;object-fit:cover" onerror="this.style.display='none'">`
    : "";

const TEMPLATES = [
  {
    id: "saas",
    name: "SaaS 經典",
    note: "白底左字右圖,最安全",
    render: (d) => `
      <div style="width:1200px;height:630px;background:#fff;font-family:${FONT};display:flex;overflow:hidden;position:relative">
        <div style="position:absolute;top:0;left:0;right:0;height:10px;background:linear-gradient(90deg,${esc(d.color)},#14b8a6)"></div>
        <div style="flex:1;padding:70px 20px 60px 70px;display:flex;flex-direction:column;justify-content:center;gap:26px;min-width:0">
          <div style="display:flex;align-items:center;gap:14px">${logoImg(d)}<span style="font-size:26px;font-weight:800;color:#111">${esc(d.site)}</span></div>
          <div style="font-size:56px;font-weight:900;line-height:1.25;color:#111">${esc(clamp(d.title, 40))}</div>
          <div style="font-size:24px;color:#555;line-height:1.6">${esc(clamp(d.desc, 70))}</div>
          <span style="align-self:flex-start;background:${esc(d.color)};color:#fff;font-size:24px;font-weight:800;padding:16px 36px;border-radius:14px">馬上看看</span>
        </div>
        ${d.image ? `<div style="width:440px;display:flex;align-items:center;justify-content:center;position:relative">
          <div style="position:absolute;width:360px;height:360px;border-radius:50%;background:${esc(d.color)}1d"></div>
          <img src="${esc(d.image)}" style="width:380px;height:380px;object-fit:cover;border-radius:24px;box-shadow:0 24px 60px rgba(0,0,0,.18);position:relative">
        </div>` : ""}
      </div>`,
  },
  {
    id: "blog",
    name: "部落格卡",
    note: "左圖斜貼,輕鬆感",
    render: (d) => `
      <div style="width:1200px;height:630px;background:#f6f5f2;font-family:${FONT};display:flex;align-items:center;overflow:hidden">
        <div style="width:540px;display:flex;justify-content:center">
          ${d.image ? `<img src="${esc(d.image)}" style="width:420px;height:420px;object-fit:cover;border-radius:20px;transform:rotate(-6deg);box-shadow:0 30px 60px rgba(0,0,0,.22);border:10px solid #fff">` : ""}
        </div>
        <div style="flex:1;padding:0 80px 0 20px;display:flex;flex-direction:column;gap:24px;min-width:0">
          <div style="display:flex;align-items:center;gap:12px">${logoImg(d, 36)}<span style="font-size:22px;font-weight:700;color:#888">${esc(d.site)}</span></div>
          <div style="font-size:52px;font-weight:900;line-height:1.3;color:#1a1a1a">${esc(clamp(d.title, 42))}</div>
          <span style="align-self:flex-start;background:#1a1a1a;color:#fff;font-size:22px;font-weight:700;padding:12px 28px;border-radius:999px">Read More</span>
        </div>
      </div>`,
  },
  {
    id: "event",
    name: "活動海報",
    note: "滿版色塊,最搶眼",
    render: (d) => `
      <div style="width:1200px;height:630px;background:${esc(d.color)};font-family:${FONT};display:flex;align-items:center;overflow:hidden;position:relative">
        <div style="position:absolute;width:420px;height:420px;border-radius:50%;background:#ffffff1f;left:-120px;bottom:-160px"></div>
        <div style="position:absolute;width:200px;height:200px;border-radius:50%;background:#ffffff17;right:340px;top:-80px"></div>
        <div style="flex:1;padding:60px 30px 60px 80px;display:flex;flex-direction:column;gap:26px;position:relative;min-width:0">
          <span style="align-self:flex-start;background:#fff;color:${esc(d.color)};font-size:22px;font-weight:800;padding:10px 24px;border-radius:999px">${esc(d.site)}</span>
          <div style="font-size:58px;font-weight:900;line-height:1.28;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.15)">${esc(clamp(d.title, 38))}</div>
          <span style="align-self:flex-start;background:#ff4757;color:#fff;font-size:24px;font-weight:800;padding:14px 34px;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.25)">立即加入</span>
        </div>
        ${d.image ? `<div style="width:430px;display:flex;align-items:center;justify-content:center">
          <img src="${esc(d.image)}" style="width:370px;height:460px;object-fit:cover;border-radius:20px;box-shadow:0 24px 60px rgba(0,0,0,.35);border:8px solid #ffffff44">
        </div>` : ""}
      </div>`,
  },
  {
    id: "cover",
    name: "滿版大圖",
    note: "og 圖當底,字壓上去",
    render: (d) => `
      <div style="width:1200px;height:630px;font-family:${FONT};position:relative;overflow:hidden;background:#111">
        ${d.image ? `<img src="${esc(d.image)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : ""}
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05) 30%,rgba(0,0,0,.82))"></div>
        <div style="position:absolute;left:70px;right:70px;bottom:56px;display:flex;flex-direction:column;gap:18px">
          <div style="display:flex;align-items:center;gap:12px">${logoImg(d, 40)}<span style="font-size:24px;font-weight:700;color:#fffc">${esc(d.site)}</span></div>
          <div style="font-size:60px;font-weight:900;line-height:1.22;color:#fff">${esc(clamp(d.title, 36))}</div>
        </div>
      </div>`,
  },
  {
    id: "minimal",
    name: "極簡置中",
    note: "最安靜,細框襯托",
    render: (d) => `
      <div style="width:1200px;height:630px;background:#fcfcfa;font-family:${FONT};display:flex;align-items:center;justify-content:center;position:relative">
        <div style="position:absolute;inset:34px;border:2px solid #1a1a1a22;border-radius:8px"></div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:30px;padding:0 120px;text-align:center">
          ${logoImg(d, 56)}
          <div style="font-size:56px;font-weight:900;line-height:1.32;color:#1a1a1a">${esc(clamp(d.title, 44))}</div>
          <div style="font-size:24px;letter-spacing:6px;color:#999;font-weight:600">${esc(String(d.site).toUpperCase())}</div>
        </div>
      </div>`,
  },
  {
    id: "dark",
    name: "深色科技",
    note: "夜間感,霓虹點綴",
    render: (d) => `
      <div style="width:1200px;height:630px;background:#0d1117;font-family:${FONT};display:flex;align-items:center;overflow:hidden;position:relative">
        <div style="position:absolute;left:0;top:0;bottom:0;width:8px;background:linear-gradient(180deg,${esc(d.color)},#14b8a6)"></div>
        <div style="flex:1;padding:60px 30px 60px 80px;display:flex;flex-direction:column;gap:26px;min-width:0">
          <div style="font-family:ui-monospace,monospace;font-size:22px;color:#14b8a6">~/${esc(d.site)}</div>
          <div style="font-size:56px;font-weight:900;line-height:1.28;color:#f0f6fc">${esc(clamp(d.title, 40))}</div>
          <div style="font-size:23px;color:#8b949e;line-height:1.6">${esc(clamp(d.desc, 70))}</div>
        </div>
        ${d.image ? `<div style="width:420px;display:flex;align-items:center;justify-content:center">
          <img src="${esc(d.image)}" style="width:340px;height:340px;object-fit:cover;border-radius:20px;box-shadow:0 0 80px ${esc(d.color)}66">
        </div>` : ""}
      </div>`,
  },
  {
    id: "gradient",
    name: "漸層品牌",
    note: "大字白字,品牌暈染",
    render: (d) => `
      <div style="width:1200px;height:630px;background:linear-gradient(135deg,${esc(d.color)},#0f766e 85%);font-family:${FONT};display:flex;flex-direction:column;justify-content:center;gap:30px;padding:0 90px;overflow:hidden;position:relative">
        <div style="position:absolute;width:520px;height:520px;border-radius:50%;background:#ffffff14;right:-160px;top:-160px"></div>
        <div style="display:flex;align-items:center;gap:14px">${logoImg(d)}<span style="font-size:26px;font-weight:800;color:#ffffffd9">${esc(d.site)}</span></div>
        <div style="font-size:66px;font-weight:900;line-height:1.22;color:#fff;max-width:960px">${esc(clamp(d.title, 36))}</div>
        <div style="font-size:25px;color:#ffffffb3;line-height:1.6;max-width:860px">${esc(clamp(d.desc, 80))}</div>
      </div>`,
  },
  {
    id: "quote",
    name: "金句引言",
    note: "標題當名言,有人味",
    render: (d) => `
      <div style="width:1200px;height:630px;background:#fffdf7;font-family:${FONT};display:flex;flex-direction:column;justify-content:center;padding:0 110px;gap:34px;position:relative;overflow:hidden">
        <div style="position:absolute;font-size:340px;font-weight:900;color:${esc(d.color)}1a;top:-70px;left:40px;font-family:serif">「</div>
        <div style="font-size:54px;font-weight:900;line-height:1.4;color:#1a1a1a;position:relative">${esc(clamp(d.title, 44))}</div>
        <div style="display:flex;align-items:center;gap:16px;position:relative">
          ${logoImg(d, 52)}
          <div><div style="font-size:26px;font-weight:800;color:#1a1a1a">${esc(d.site)}</div>
          <div style="font-size:20px;color:#999">${esc(clamp(d.desc, 40))}</div></div>
        </div>
      </div>`,
  },
  {
    id: "split",
    name: "對比雙欄",
    note: "左色右白,資訊分區",
    render: (d) => `
      <div style="width:1200px;height:630px;font-family:${FONT};display:flex;overflow:hidden">
        <div style="width:520px;background:${esc(d.color)};display:flex;flex-direction:column;justify-content:center;gap:24px;padding:0 54px">
          <div style="display:flex;align-items:center;gap:12px">${logoImg(d, 40)}<span style="font-size:23px;font-weight:800;color:#ffffffe6">${esc(d.site)}</span></div>
          <div style="font-size:46px;font-weight:900;line-height:1.3;color:#fff">${esc(clamp(d.title, 34))}</div>
        </div>
        <div style="flex:1;background:#fff;display:flex;flex-direction:column;justify-content:center;gap:26px;padding:0 60px;min-width:0">
          ${d.image ? `<img src="${esc(d.image)}" style="width:100%;height:300px;object-fit:cover;border-radius:18px;box-shadow:0 16px 40px rgba(0,0,0,.14)">` : ""}
          <div style="font-size:23px;color:#555;line-height:1.65">${esc(clamp(d.desc, 84))}</div>
        </div>
      </div>`,
  },
];

if (typeof module !== "undefined") module.exports = { TEMPLATES };
if (typeof window !== "undefined") window.OG_TEMPLATES = TEMPLATES;
