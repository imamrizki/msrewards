/* ===============================
 * VERSION
 * =============================== */
const VERSION = "5.0.0";
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
  let url;

  if (!isEdgeBrowser() || SEARCH_STEP === 0) {
    url = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}&FORM=QBRE`;
  } else {
    url =
      `https://www.bing.com/search?q=${encodeURIComponent(keyword)}` +
      `&qs=SSE&sk=HS${randInt(1,15)}SSE${randInt(1,5)}` +
      `&sc=${randInt(10,30)}-${randInt(0,2)}&FORM=QBRE`;
  }

  SEARCH_STEP++;
  sessionStorage.setItem("SEARCH_STEP", SEARCH_STEP);
  return url;
}

/* ===============================
 * KEYWORD MODULE
 * =============================== */
let keywordIndex = 0;
let keywordStatus = keywords_bank.map(k => ({ keyword: k, isOpened: false }));
let KEYWORD_LOCK = false;

function runKeyword() {
  if (!AUTO_KEYWORD && event?.type !== "click") return;
  if (keywordIndex >= keywordStatus.length || KEYWORD_LOCK) return;

  KEYWORD_LOCK = true;

  applyDwell("keyword", () => {
    const k = keywordStatus[keywordIndex];
    k.isOpened = true;
    openKeywordTab(buildSearchUrl(k.keyword));
    keywordIndex++;
    updateKeywordUI();
    KEYWORD_LOCK = false;
  });
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
    const a = articleStatus[articleIndex];
    a.isOpened = true;
    openArticleTab(`https://www.msn.com/${a.article}`);
    articleIndex++;
    updateArticleUI();
    ARTICLE_LOCK = false;
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
