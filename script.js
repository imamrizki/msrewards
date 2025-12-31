/* ===============================
 * VERSION
 * =============================== */
const VERSION = "3.1.0";
if (localStorage.getItem("VERSION") !== VERSION) {
  localStorage.clear();
  localStorage.setItem("VERSION", VERSION);
}

/* ===============================
 * GLOBAL STATE
 * =============================== */
let AUTO_MODE = localStorage.getItem("AUTO_MODE") === "true";

let keywordTab = null;
let articleTab = null;

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
 * SAFE TAB HANDLER
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
 * IDLE RESET (INTI FITUR)
 * =============================== */
const IDLE_LIMIT = 90 * 1000; // 90 detik
let lastActivityTime = Date.now();

function resetBehavior() {
  SEARCH_STEP = 0;
  sessionStorage.setItem("SEARCH_STEP", SEARCH_STEP);

  console.log("[IDLE RESET] Behavior reset (SEARCH_STEP = 0)");
}

function updateActivity() {
  lastActivityTime = Date.now();
}

["mousemove", "keydown", "click", "scroll"].forEach(evt => {
  document.addEventListener(evt, updateActivity, true);
});

setInterval(() => {
  if (Date.now() - lastActivityTime > IDLE_LIMIT) {
    resetBehavior();
    lastActivityTime = Date.now(); // cegah reset berulang
  }
}, 5000);

/* ===============================
 * DWELL SIMULATION (DIFFERENT)
 * =============================== */
function simulateScrollDepthKeyword() {
  return randInt(5, 35);
}

function simulateScrollDepthArticle() {
  return randInt(40, 95);
}

function dwellTimeKeyword(depth) {
  return randInt(2000, 4000) + depth * randInt(20, 40);
}

function dwellTimeArticle(depth) {
  return randInt(6000, 10000) + depth * randInt(60, 100);
}

function applyDwell(type, callback) {
  let depth, delay;

  if (type === "keyword") {
    depth = simulateScrollDepthKeyword();
    delay = dwellTimeKeyword(depth);
  } else {
    depth = simulateScrollDepthArticle();
    delay = dwellTimeArticle(depth);
  }

  console.log(`[DWELL-${type.toUpperCase()}] ${depth}% | ${delay}ms`);
  setTimeout(callback, delay);
}

/* ===============================
 * EDGE SEARCH BUILDER (BEHAVIOR)
 * =============================== */
let SEARCH_STEP = Number(sessionStorage.getItem("SEARCH_STEP") || 0);

function buildSearchUrl(keyword) {
  let url;

  if (!isEdgeBrowser()) {
    url = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}&FORM=MSNVS`;
  } else {
    if (SEARCH_STEP === 0) {
      url = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}&FORM=QBRE`;
    } else {
      url =
        `https://www.bing.com/search` +
        `?q=${encodeURIComponent(keyword)}` +
        `&qs=SSE` +
        `&sk=HS${randInt(1,15)}SSE${randInt(1,5)}` +
        `&sc=${randInt(10,30)}-${randInt(0,2)}` +
        `&FORM=QBRE`;
    }
  }

  SEARCH_STEP++;
  sessionStorage.setItem("SEARCH_STEP", SEARCH_STEP);
  return url;
}

/* ===============================
 * KEYWORD MODULE
 * =============================== */
let keywordIndex = 0;
let keywordStatus = keywords_bank.map(k => ({
  keyword: k,
  isOpened: false
}));

document.getElementById("btn-search").onclick = () => {
  if (keywordIndex >= keywordStatus.length) return;

  applyDwell("keyword", () => {
    const kw = keywordStatus[keywordIndex];
    kw.isOpened = true;
    openKeywordTab(buildSearchUrl(kw.keyword));
    keywordIndex++;
    updateKeywordUI();
  });
};

function updateKeywordUI() {
  document.getElementById("current-index-keyword").innerText = keywordIndex;
  document.getElementById("total-keyword").innerText = keywordStatus.length;

  const tbody = document.querySelector("#table-keywords tbody");
  tbody.innerHTML = "";

  const MAX_VISIBLE = 7;
  const half = Math.floor(MAX_VISIBLE / 2);

  let start = Math.max(0, keywordIndex - half);
  let end = Math.min(keywordStatus.length, start + MAX_VISIBLE);

  // adjust kalau di ujung
  if (end - start < MAX_VISIBLE) {
    start = Math.max(0, end - MAX_VISIBLE);
  }

  // indikator awal
  if (start > 0) {
    tbody.innerHTML += `
      <tr>
        <td colspan="3" style="text-align:center;">...</td>
      </tr>`;
  }

  // render slice
  for (let i = start; i < end; i++) {
    const k = keywordStatus[i];
    tbody.innerHTML += `
      <tr ${i === keywordIndex ? 'style="background:#eef;"' : ''}>
        <td>${i + 1}</td>
        <td>${k.keyword}</td>
        <td class="${k.isOpened ? "opened" : "not-opened"}">
          ${k.isOpened ? "Sudah Dibuka" : "Belum Dibuka"}
        </td>
      </tr>`;
  }

  // indikator akhir
  if (end < keywordStatus.length) {
    tbody.innerHTML += `
      <tr>
        <td colspan="3" style="text-align:center;">...</td>
      </tr>`;
  }
}
updateKeywordUI();

/* ===============================
 * ARTICLE MODULE
 * =============================== */
let articleIndex = 0;
let articleStatus = news_bank.map(a => ({
  article: a,
  isOpened: false
}));

document.getElementById("btn-search-article").onclick = () => {
  if (articleIndex >= articleStatus.length) return;

  applyDwell("article", () => {
    const art = articleStatus[articleIndex];
    art.isOpened = true;
    openArticleTab(`https://www.msn.com/${art.article}`);
    articleIndex++;
    updateArticleUI();
  });
};

function updateArticleUI() {
  document.getElementById("current-index-article").innerText = articleIndex;
  document.getElementById("total-article").innerText = articleStatus.length;

  const tbody = document.querySelector("#table-articles tbody");
  tbody.innerHTML = "";
  articleStatus.forEach((a, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${a.article}</td>
        <td class="${a.isOpened ? "opened" : "not-opened"}">
          ${a.isOpened ? "Sudah Dibuka" : "Belum Dibuka"}
        </td>
      </tr>`;
  });
}
updateArticleUI();

/* ===============================
 * AUTO MODE
 * =============================== */
const toggle = document.getElementById("auto-toggle");
toggle.checked = AUTO_MODE;

toggle.onchange = () => {
  AUTO_MODE = toggle.checked;
  localStorage.setItem("AUTO_MODE", AUTO_MODE);
};

setInterval(() => {
  if (AUTO_MODE) document.getElementById("btn-search").click();
}, randInt(6000, 9000));

setInterval(() => {
  if (AUTO_MODE) document.getElementById("btn-search-article").click();
}, randInt(12000, 18000));
