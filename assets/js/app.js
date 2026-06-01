/* =========================================================
   공통 스크립트: 모든 페이지에서 사용
   - 헤더/푸터 채우기, 네비게이션, 프로필(profile.json) 로드
   - 홈 화면, 갤러리 화면 렌더링
   - 다른 스크립트(reviews.js, review.js)에서 쓰는 도구(Site.*)
   ========================================================= */
const Site = {
  async fetchJSON(url) {
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) throw new Error(`${url} (${r.status})`);
    return r.json();
  },
  async fetchText(url) {
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) throw new Error(`${url} (${r.status})`);
    return r.text();
  },
  escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  },
  formatDate(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || ""));
    if (!m) return s || "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[+m[2] - 1]} ${+m[3]}, ${m[1]}`;
  },
  // 파일 맨 위 --- ... --- 머리말을 읽어 분리
  parseFrontMatter(text) {
    const m = /^﻿?---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/.exec(text);
    const meta = {};
    if (!m) return { meta, body: text };
    const strip = (s) => (/^["'].*["']$/.test(s) ? s.slice(1, -1) : s);
    for (const raw of m[1].split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const i = line.indexOf(":");
      if (i === -1) continue;
      const key = line.slice(0, i).trim();
      let val = line.slice(i + 1).trim();
      if (val.startsWith("[") && val.endsWith("]")) {
        meta[key] = val.slice(1, -1).split(",").map((x) => strip(x.trim())).filter(Boolean);
      } else {
        meta[key] = strip(val);
      }
    }
    return { meta, body: text.slice(m[0].length) };
  },
  // 리뷰 카드 HTML (목록 페이지와 홈에서 공용)
  reviewCard(it) {
    const tags = (it.tags || []).map((t) => `<span class="chip">${Site.escapeHtml(t)}</span>`).join("");
    const meta = [it.authors, it.venue].filter(Boolean).map(Site.escapeHtml).join(" · ");
    return `<a class="card" href="review.html?id=${encodeURIComponent(it.id)}">
      <div class="card-body">
        ${it.date ? `<time class="card-date">${Site.escapeHtml(Site.formatDate(it.date))}</time>` : ""}
        <h3 class="card-title">${Site.escapeHtml(it.title || it.id)}</h3>
        ${meta ? `<p class="card-meta">${meta}</p>` : ""}
        ${it.summary ? `<p class="card-summary">${Site.escapeHtml(it.summary)}</p>` : ""}
        ${tags ? `<div class="chips">${tags}</div>` : ""}
      </div>
    </a>`;
  },
};
window.Site = Site;

// 간단한 아이콘 모음 (링크 종류별)
const ICONS = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 8.8 21.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.300-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  scholar: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 9-4.9V17h2V9zM5 13.2V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.8l-7 3.8z"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></svg>',
};
const iconSvg = (name) => ICONS[name] || ICONS.link;

// 프로필 값으로 [data-profile="키"] 요소 채우기 (research.summary 같은 중첩 키 지원)
function fillProfile(profile) {
  document.querySelectorAll("[data-profile]").forEach((el) => {
    const val = el.dataset.profile.split(".").reduce((o, k) => (o == null ? o : o[k]), profile);
    if (val != null && val !== "") el.textContent = val;
  });
}

// 링크 목록을 컨테이너에 렌더 (url 빈 항목은 건너뜀)
function renderLinks(container, links) {
  if (!container) return;
  const valid = (links || []).filter((l) => l.url && l.url.trim());
  container.innerHTML = valid
    .map((l) => {
      const ext = !l.url.startsWith("mailto:") ? ' target="_blank" rel="noopener"' : "";
      return `<a class="link-pill" href="${Site.escapeHtml(l.url)}"${ext}>${iconSvg(l.icon)}<span>${Site.escapeHtml(l.label)}</span></a>`;
    })
    .join("");
}

// 공통 초기화: 연도, 모바일 메뉴, 활성 메뉴 표시, 프로필 로드
async function initCommon() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const page = document.body.dataset.page;
  document.querySelectorAll(`[data-nav]`).forEach((a) => {
    if (a.dataset.nav === page) a.classList.add("active");
  });

  try {
    const profile = await Site.fetchJSON("./data/profile.json");
    window.__profile = profile;
    document.title = document.title.replace("{name}", profile.name || "");
    fillProfile(profile);
    renderLinks(document.getElementById("contact-links"), profile.links);
    const interests = document.getElementById("interests");
    if (interests && profile.research && Array.isArray(profile.research.interests)) {
      interests.innerHTML = profile.research.interests
        .map((t) => `<span class="chip">${Site.escapeHtml(t)}</span>`)
        .join("");
    }
    const avatar = document.querySelector("[data-avatar]");
    if (avatar && profile.avatar) avatar.src = profile.avatar;
  } catch (e) {
    console.warn("profile.json을 불러오지 못했습니다.", e);
  }
}

// 홈: 최근 리뷰 3개
async function initHome() {
  const box = document.getElementById("recent-reviews");
  if (!box) return;
  try {
    const items = await Site.fetchJSON("./reviews/manifest.json");
    if (!items.length) {
      box.innerHTML = `<p class="notice">No reviews yet. Try adding a .md file to the <code>reviews/</code> folder.</p>`;
      return;
    }
    box.innerHTML = items.slice(0, 3).map(Site.reviewCard).join("");
  } catch (e) {
    box.innerHTML = `<p class="notice muted">Could not load the review list. (When viewing locally, use the "Preview" method in the README.)</p>`;
  }
}

// 갤러리
async function initGallery() {
  const box = document.getElementById("gallery-list");
  if (!box) return;
  try {
    const data = await Site.fetchJSON("./data/gallery.json");
    const items = data.items || [];
    if (!items.length) {
      box.innerHTML = `<p class="notice">Nothing here yet. Add items in <code>data/gallery.json</code>.</p>`;
      return;
    }
    box.innerHTML = items
      .map((it) => {
        const cap = `<figcaption><div class="t-title">${Site.escapeHtml(it.title || "")}</div>${it.caption ? `<div class="t-cap">${Site.escapeHtml(it.caption)}</div>` : ""}</figcaption>`;
        const img = `<img src="${Site.escapeHtml(it.image)}" alt="${Site.escapeHtml(it.title || "")}" loading="lazy">`;
        const inner = `<figure class="tile">${img}${cap}</figure>`;
        return it.link && it.link.trim()
          ? `<a href="${Site.escapeHtml(it.link)}" target="_blank" rel="noopener">${inner}</a>`
          : inner;
      })
      .join("");
  } catch (e) {
    box.innerHTML = `<p class="notice muted">Could not load the gallery.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await initCommon();
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "gallery") initGallery();
});
