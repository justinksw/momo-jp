import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const cardsRoot = path.join(root, "cards");
const dataDir = path.join(root, "data");
const cardPagesDir = path.join(root, "card");

const BASE = "/momo-jp";

marked.setOptions({ gfm: true, breaks: true });

const CATEGORY_LABELS = {
  vocabulary: "語彙",
  grammar: "文法",
  "fun-fact": "豆知識",
  history: "歴史",
  society: "社会",
  culture: "文化",
  food: "食",
  living: "生活",
  travel: "旅行",
  fashion: "ファッション",
};

function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("Missing front matter");
  const fm = {};
  for (const line of match[1].split("\n")) {
    const titleM = line.match(/^title:\s*(.+)$/);
    if (titleM) fm.title = titleM[1].trim();
    const dateM = line.match(/^date:\s*(.+)$/);
    if (dateM) fm.date = dateM[1].trim();
    const catM = line.match(/^categories:\s*\[(.*)\]\s*$/);
    if (catM) {
      fm.categories = catM[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return { meta: fm, body: match[2] };
}

function findCardFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) findCardFiles(p, acc);
    else if (ent.name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

function formatDateJa(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const now = new Date();
  const thisYear = now.getFullYear();
  if (y === thisYear) return `${m}/${d}`;
  return `${y}年${m}月${d}日`;
}

function categoryChipsHtml(categories) {
  return categories
    .map(
      (slug) =>
        `<span class="chip chip--cat" data-cat="${slug}">${CATEGORY_LABELS[slug] || slug}</span>`
    )
    .join("");
}

function previewBannerHtml() {
  return `<div class="preview-banner" role="status">PREVIEW</div>`;
}

function pageShell({ title, bodyClass, mainHtml }) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} · 勉強メモ</title>
  <link rel="stylesheet" href="${BASE}/styles.css">
</head>
<body class="${bodyClass}">
${previewBannerHtml()}
${mainHtml}
</body>
</html>`;
}

function renderDetailPage(card) {
  const htmlBody = marked.parse(card.body);
  const dateLabel = formatDateJa(card.date);
  const main = `
<main class="detail">
  <header class="detail__head">
    <a class="back-link" href="${BASE}/">戻る</a>
    <h1>${escapeHtml(card.title)}</h1>
    <div class="detail__meta">
      <time datetime="${card.date}">${dateLabel}</time>
      ${categoryChipsHtml(card.categories)}
    </div>
  </header>
  <article class="detail__body prose">
${htmlBody}
  </article>
</main>`;
  return pageShell({
    title: escapeHtml(card.title),
    bodyClass: "page-detail",
    mainHtml: main,
  });
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const files = findCardFiles(cardsRoot);
const cards = [];

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const { meta, body } = parseFrontMatter(raw);
  const base = path.basename(file, ".md");
  if (!meta.title || !meta.date || !meta.categories?.length) {
    throw new Error(`Invalid card: ${file}`);
  }
  cards.push({
    slug: base,
    title: meta.title,
    date: meta.date,
    categories: meta.categories,
    body,
  });
}

cards.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(cardPagesDir, { recursive: true });

const indexPayload = cards.map(({ slug, title, date, categories }) => ({
  slug,
  title,
  date,
  categories,
}));

fs.writeFileSync(
  path.join(dataDir, "cards.json"),
  JSON.stringify(indexPayload, null, 2) + "\n"
);

for (const card of cards) {
  const out = path.join(cardPagesDir, `${card.slug}.html`);
  fs.writeFileSync(out, renderDetailPage(card));
}

console.log(`Built ${cards.length} card(s).`);
