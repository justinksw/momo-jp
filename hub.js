const BASE = "/momo-jp";

const CATEGORY_SLUGS = [
  "vocabulary",
  "grammar",
  "fun-fact",
  "history",
  "society",
  "culture",
  "food",
  "living",
  "travel",
  "fashion",
];

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

const PERIOD_LABELS = {
  day: "今日",
  week: "今週",
  month: "今月",
  year: "今年",
  all: "全部",
};

/** @returns {Date} calendar parts in Asia/Hong_Kong */
function hkTodayParts() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return {
    y: Number(get("year")),
    m: Number(get("month")),
    d: Number(get("day")),
  };
}

function parseCardDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return { y, m, d };
}

function hkWeekRange(today) {
  const utc = Date.UTC(today.y, today.m - 1, today.d);
  const dow = new Date(utc).getUTCDay();
  const monOffset = dow === 0 ? -6 : 1 - dow;
  const mon = new Date(utc + monOffset * 86400000);
  const sun = new Date(mon.getTime() + 6 * 86400000);
  const toParts = (dt) => ({
    y: dt.getUTCFullYear(),
    m: dt.getUTCMonth() + 1,
    d: dt.getUTCDate(),
  });
  return { start: toParts(mon), end: toParts(sun) };
}

function dateInRange(card, start, end) {
  const c = parseCardDate(card.date);
  const cv = c.y * 10000 + c.m * 100 + c.d;
  const sv = start.y * 10000 + start.m * 100 + start.d;
  const ev = end.y * 10000 + end.m * 100 + end.d;
  return cv >= sv && cv <= ev;
}

function matchesPeriod(card, period, today) {
  const c = parseCardDate(card.date);
  switch (period) {
    case "day":
      return c.y === today.y && c.m === today.m && c.d === today.d;
    case "week": {
      const { start, end } = hkWeekRange(today);
      return dateInRange(card, start, end);
    }
    case "month":
      return c.y === today.y && c.m === today.m;
    case "year":
      return c.y === today.y;
    case "all":
      return true;
    default:
      return true;
  }
}

function matchesCategories(card, selected) {
  if (selected.size === 0) return true;
  return [...selected].every((cat) => card.categories.includes(cat));
}

function formatListDate(dateStr, todayYear) {
  const { y, m, d } = parseCardDate(dateStr);
  if (y === todayYear) return `${m}/${d}`;
  return `${y}年${m}月${d}日`;
}

let allCards = [];
let period = "day";
const selectedCats = new Set();

async function init() {
  const res = await fetch(`${BASE}/data/cards.json`);
  allCards = await res.json();
  renderPeriodChips();
  renderCategoryChips();
  bindClear();
  update();
}

function renderPeriodChips() {
  const row = document.getElementById("period-chips");
  row.innerHTML = "";
  for (const [value, label] of Object.entries(PERIOD_LABELS)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip chip--period";
    btn.textContent = label;
    btn.setAttribute("aria-pressed", value === period ? "true" : "false");
    btn.dataset.period = value;
    btn.addEventListener("click", () => {
      period = value;
      row.querySelectorAll(".chip--period").forEach((el) => {
        el.setAttribute("aria-pressed", el.dataset.period === period ? "true" : "false");
      });
      update();
    });
    row.appendChild(btn);
  }
}

function renderCategoryChips() {
  const row = document.getElementById("category-chips");
  row.innerHTML = "";
  for (const slug of CATEGORY_SLUGS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip chip--cat";
    btn.textContent = CATEGORY_LABELS[slug];
    btn.dataset.cat = slug;
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", () => {
      if (selectedCats.has(slug)) selectedCats.delete(slug);
      else selectedCats.add(slug);
      btn.setAttribute("aria-pressed", selectedCats.has(slug) ? "true" : "false");
      update();
    });
    row.appendChild(btn);
  }
}

function bindClear() {
  const clear = document.getElementById("cat-clear");
  clear.addEventListener("click", () => {
    selectedCats.clear();
    document.querySelectorAll(".chip--cat").forEach((el) => {
      el.setAttribute("aria-pressed", "false");
    });
    update();
  });
}

function update() {
  const today = hkTodayParts();
  const filtered = allCards.filter(
    (c) => matchesPeriod(c, period, today) && matchesCategories(c, selectedCats)
  );

  document.getElementById("count").textContent = `${filtered.length}件`;

  const clearBtn = document.getElementById("cat-clear");
  clearBtn.disabled = selectedCats.size === 0;

  document.querySelectorAll(".chip--cat").forEach((el) => {
    const slug = el.dataset.cat;
    if (selectedCats.has(slug)) {
      el.classList.remove("chip--dim");
      return;
    }
    const testCats = new Set(selectedCats);
    testCats.add(slug);
    const n = allCards.filter(
      (c) => matchesPeriod(c, period, today) && matchesCategories(c, testCats)
    ).length;
    el.classList.toggle("chip--dim", n === 0);
  });

  const list = document.getElementById("card-list");
  const empty = document.getElementById("empty");
  list.innerHTML = "";

  if (filtered.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  for (const card of filtered) {
    const li = document.createElement("li");
    li.className = "card-row";
    const chips = card.categories
      .map(
        (slug) =>
          `<span class="chip chip--cat">${CATEGORY_LABELS[slug] || slug}</span>`
      )
      .join("");
    li.innerHTML = `
      <a href="${BASE}/card/${card.slug}.html">
        <p class="card-row__title">${escapeHtml(card.title)}</p>
        <div class="card-row__meta">
          <span>${formatListDate(card.date, today.y)}</span>
          ${chips}
        </div>
      </a>`;
    list.appendChild(li);
  }
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

init();
