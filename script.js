/* ===============================
 * VERSION
 * =============================== */
const VERSION = "5.2.0";
if (localStorage.getItem("VERSION") !== VERSION) {
  localStorage.clear();
  localStorage.setItem("VERSION", VERSION);
}

/* ===============================
 * AUTO STATE (PISAH)
 * =============================== */
let AUTO_KEYWORD = localStorage.getItem("AUTO_KEYWORD") === "true";
let AUTO_ARTICLE = localStorage.getItem("AUTO_ARTICLE") === "true";

/* ===============================
 * GLOBAL STATE
 * =============================== */
let keywordTab = null;
let articleTab = null;
let SEARCH_STEP = Number(sessionStorage.getItem("SEARCH_STEP") || 0);
let CURRENT_BING_FORM = sessionStorage.getItem("BING_FORM");
let BATCH_COOLDOWN = false;

/* ===============================
 * GLOBAL CONFIG
 * =============================== */
const BING_FORM_POOL = [
  "ANNTH1", // news / widget
  "QBLH",   // bing homepage
  "MSNVS",  // msn / feed
  "QBRE",   // regular bing search
  "EDGEAR"  // edge address bar
];

/* ===============================
 * UTIL
 * =============================== */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isEdgeBrowser() {
  const ua = navigator.userAgent;
  return ua.includes("Edg/") && !ua.includes("OPR/") && !ua.includes("Brave");
}

function getRefig() {
  let refig = sessionStorage.getItem("BING_REFIG");
  if (!refig) {
    refig = crypto.randomUUID().replace(/-/g, "");
    sessionStorage.setItem("BING_REFIG", refig);
  }
  return refig;
}

function rotateBingForm() {
  const form =
    BING_FORM_POOL[randInt(0, BING_FORM_POOL.length - 1)];

  CURRENT_BING_FORM = form;
  sessionStorage.setItem("BING_FORM", form);

  console.log("[FORM ROTATE]", form);
}

function applyMicroDelay(callback) {
  const delay = randInt(150, 1200); // ms
  setTimeout(callback, delay);
}

function applyBatchCooldown(callback) {
  const delay = randInt(30000, 120000); // 30–120 detik

  BATCH_COOLDOWN = true;
  console.log(`[COOLDOWN] Batch pause ${delay / 1000}s`);

  setTimeout(() => {
    BATCH_COOLDOWN = false;
    callback();
  }, delay);
}

/* ===============================
 * SAFE TAB
 * =============================== */
function openKeywordTab(url) {
  if (!keywordTab || keywordTab.closed) {
    keywordTab = window.open(url, "_blank");
  } else {
    keywordTab.location.href = url;
    keywordTab.focus();
  }
}

function openArticleTab(url) {
  if (!articleTab || articleTab.closed) {
    articleTab = window.open(url, "_blank");
  } else {
    articleTab.location.href = url;
    articleTab.focus();
  }
}

/* ===============================
 * IDLE RESET
 * =============================== */
const IDLE_LIMIT = 90 * 1000;
let lastActivity = Date.now();

["mousemove", "keydown", "click", "scroll"].forEach(e =>
  document.addEventListener(e, () => lastActivity = Date.now(), true)
);

setInterval(() => {
  if (Date.now() - lastActivity > IDLE_LIMIT) {
    SEARCH_STEP = 0;
    sessionStorage.setItem("SEARCH_STEP", SEARCH_STEP);
  }
}, 5000);

/* ===============================
 * DWELL
 * =============================== */
function applyDwell(type, cb) {
  const depth = type === "keyword"
    ? randInt(5, 35)
    : randInt(40, 95);

  const delay = type === "keyword"
    ? randInt(2000, 4000) + depth * randInt(20, 40)
    : randInt(6000, 10000) + depth * randInt(60, 100);

  setTimeout(cb, delay);
}

/* ===============================
 * EDGE SEARCH BUILDER
 * =============================== */
function buildSearchUrl(keyword) {
  const refig = getRefig();

  const form = CURRENT_BING_FORM || "ANNTH1";

  return (
    "https://www.bing.com/search" +
    `?q=${encodeURIComponent(keyword)}` +
    `&form=${form}` +
    `&refig=${refig}` +
    "&pc=U531"
  );
}

/* ===============================
 * KEYWORD MODULE
 * =============================== */
let keywordIndex = 0;
let keywordStatus = [];
let KEYWORD_LOCK = false;

function runKeyword() {
  if (!AUTO_KEYWORD && event?.type !== "click") return;
  if (keywordIndex >= keywordStatus.length || KEYWORD_LOCK) return;
  if (BATCH_COOLDOWN) return;

  KEYWORD_LOCK = true;

  applyDwell("keyword", () => {
    applyMicroDelay(() => {
      const k = keywordStatus[keywordIndex];
      k.isOpened = true;
      openKeywordTab(buildSearchUrl(k.keyword));
      keywordIndex++;
      updateKeywordUI();
      KEYWORD_LOCK = false;
    });
  });
}

function generateRuleBasedKeywords(limit = 30) {
  const results = new Set();

  while (results.size < limit) {
    const type = randInt(1, 3);
    let keyword = "";

    if (type === 1) {
      keyword =
        KEYWORD_RULES.subjects[randInt(0, KEYWORD_RULES.subjects.length - 1)];
    }

    if (type === 2) {
      keyword =
        KEYWORD_RULES.subjects[randInt(0, KEYWORD_RULES.subjects.length - 1)] +
        " " +
        KEYWORD_RULES.objects[randInt(0, KEYWORD_RULES.objects.length - 1)];
    }

    if (type === 3) {
      keyword =
        KEYWORD_RULES.verbs[randInt(0, KEYWORD_RULES.verbs.length - 1)] +
        " " +
        KEYWORD_RULES.tech[randInt(0, KEYWORD_RULES.tech.length - 1)];
    }

    results.add(keyword.trim());
  }

  return Array.from(results);
}

function initKeywordModule(reset = true) {
  if (reset) {
    keywordIndex = 0;
    rotateBingForm();
  }

  const generated = generateRuleBasedKeywords(25);

  keywordStatus = generated.map(k => ({
    keyword: k,
    isOpened: false
  }));

  updateKeywordUI();
}

document.getElementById("btn-search").onclick = runKeyword;

/* ===============================
 * ARTICLE MODULE
 * =============================== */
let articleIndex = 0;
let articleStatus = news_bank.map(a => ({ article: a, isOpened: false }));
let ARTICLE_LOCK = false;

function runArticle() {
  if (!AUTO_ARTICLE && event?.type !== "click") return;
  if (articleIndex >= articleStatus.length || ARTICLE_LOCK) return;

  ARTICLE_LOCK = true;

  applyDwell("article", () => {
    applyMicroDelay(() => {
      const a = articleStatus[articleIndex];
      a.isOpened = true;
      openArticleTab(`https://www.msn.com/${a.article}`);
      articleIndex++;
      updateArticleUI();
      ARTICLE_LOCK = false;
    });
  });
}

document.getElementById("btn-search-article").onclick = runArticle;

/* ===============================
 * UI (WINDOWED TABLE)
 * =============================== */
function renderTable(tbody, list, index) {
  tbody.innerHTML = "";

  const MAX = 7;
  const half = Math.floor(MAX / 2);

  let start = Math.max(0, index - half);
  let end = Math.min(list.length, start + MAX);
  if (end - start < MAX) start = Math.max(0, end - MAX);

  if (start > 0) tbody.innerHTML += `<tr><td colspan="3">...</td></tr>`;

  for (let i = start; i < end; i++) {
    const item = list[i];
    tbody.innerHTML += `
      <tr ${i === index ? 'style="background:#eef"' : ''}>
        <td>${i + 1}</td>
        <td>${item.keyword || item.article}</td>
        <td class="${item.isOpened ? "opened" : "not-opened"}">
          ${item.isOpened ? "Sudah Dibuka" : "Belum Dibuka"}
        </td>
      </tr>`;
  }

  if (end < list.length) tbody.innerHTML += `<tr><td colspan="3">...</td></tr>`;
}

function updateKeywordUI() {
  document.getElementById("current-index-keyword").innerText = keywordIndex;
  document.getElementById("total-keyword").innerText = keywordStatus.length;
  renderTable(
    document.querySelector("#table-keywords tbody"),
    keywordStatus,
    keywordIndex
  );
}

function updateArticleUI() {
  document.getElementById("current-index-article").innerText = articleIndex;
  document.getElementById("total-article").innerText = articleStatus.length;
  renderTable(
    document.querySelector("#table-articles tbody"),
    articleStatus,
    articleIndex
  );
}

updateKeywordUI();
updateArticleUI();

/* ===============================
 * TOGGLE HANDLER
 * =============================== */
const keywordToggle = document.getElementById("auto-keyword-toggle");
const articleToggle = document.getElementById("auto-article-toggle");

keywordToggle.checked = AUTO_KEYWORD;
articleToggle.checked = AUTO_ARTICLE;

keywordToggle.onchange = () => {
  AUTO_KEYWORD = keywordToggle.checked;
  localStorage.setItem("AUTO_KEYWORD", AUTO_KEYWORD);
};

articleToggle.onchange = () => {
  AUTO_ARTICLE = articleToggle.checked;
  localStorage.setItem("AUTO_ARTICLE", AUTO_ARTICLE);
};

/* ===============================
 * AUTO LOOP (SIMETRIS)
 * =============================== */
setInterval(() => {
  if (AUTO_KEYWORD) runKeyword();
}, 3000);

setInterval(() => {
  if (AUTO_ARTICLE) runArticle();
}, 4000);

setInterval(() => {
  if (keywordIndex >= keywordStatus.length && !BATCH_COOLDOWN) {
    applyBatchCooldown(() => {
      console.log("[ROTATE] Cooldown selesai, generate batch baru");
      initKeywordModule(true);
    });
  }
}, 5000);

document.addEventListener("DOMContentLoaded", () => {
  initKeywordModule(true);
});