# og-studio 🖼️

**OG 圖試衣間** — 貼一個網址,抓下它的 OG 資料(標題/描述/圖片/favicon),套進九種模板讓你挑,選中直接下載 1200×630 PNG。

```bash
npm install && npm start   # → http://localhost:5610
```

## 功能

- `/api/og?url=` 抓取任意頁面的 og:title / og:description / og:image / icon / theme-color;og:image 缺席時自動撿頁面內文第一張像樣的圖
- 九種模板:SaaS 經典、部落格卡、活動海報、滿版大圖、極簡置中、深色科技、漸層品牌、金句引言、對比雙欄
- 所有欄位(標題/站名/描述/圖/logo/主色)抓完可手動微調,改了即時重渲染
- 匯出走 playwright-core + **系統內建 Edge/Chrome**(不用下載瀏覽器),預覽 iframe 與匯出截圖共用同一份 `/preview` 渲染 — 所見即所得

## 架構

```
server.js            零依賴 http server:/api/og 抓取、/preview 渲染、/api/export 截圖
public/templates.js  模板庫(瀏覽器預覽與 server 出圖共用)
public/index.html    挑選 UI
```

## 地雷(踩過)

- 模板 inline style 都在 `style="…"` 雙引號屬性裡 — **font-family 只能用單引號**,雙引號會把屬性提前終結,`display:flex` 之後全被吃掉、版面靜默塌掉。

## License

MIT © Jeffrey0117
