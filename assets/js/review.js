/* 개별 리뷰 페이지: .md 파일을 불러와 마크다운 + 수식 + 코드로 렌더 */
(async function () {
  if (document.body.dataset.page !== "review") return;

  const el = document.getElementById("review");
  const id = new URLSearchParams(location.search).get("id");

  const errorBox = (msg) =>
    `<p class="notice error">${Site.escapeHtml(msg)}</p>
     <p class="center"><a class="btn" href="reviews.html">← Back to the list</a></p>`;

  if (!id || /[\\/]/.test(id)) {
    el.innerHTML = errorBox("Invalid address.");
    return;
  }

  let text;
  try {
    text = await Site.fetchText(`./reviews/${id}.md`);
  } catch (e) {
    el.innerHTML = errorBox("Review not found.");
    return;
  }

  const { meta, body } = Site.parseFrontMatter(text);
  if (meta.title) document.title = `${meta.title} · Paper Review`;

  // ── 머리말 → 제목/메타 영역 ─────────────────────────────
  const metaLine = [meta.authors, meta.venue, meta.date ? Site.formatDate(meta.date) : ""]
    .filter(Boolean)
    .map((s) => `<span>${Site.escapeHtml(s)}</span>`)
    .join("");
  const linkBtn = meta.link
    ? `<p style="margin-top:14px"><a class="btn" href="${Site.escapeHtml(meta.link)}" target="_blank" rel="noopener">View original paper ↗</a></p>`
    : "";
  const tags = (meta.tags || []).map((t) => `<span class="chip">${Site.escapeHtml(t)}</span>`).join("");
  const head = `<header class="review-head">
      <a class="back-link" href="reviews.html">← Paper reviews</a>
      <h1>${Site.escapeHtml(meta.title || id)}</h1>
      ${metaLine ? `<div class="review-meta">${metaLine}</div>` : ""}
      ${tags ? `<div class="chips">${tags}</div>` : ""}
      ${linkBtn}
    </header>`;

  // ── 본문 렌더 ───────────────────────────────────────────
  el.innerHTML = head + `<div class="prose">${renderMarkdown(body)}</div>`;

  // 코드 강조 (highlight.js)
  if (window.hljs) {
    el.querySelectorAll("pre code").forEach((b) => window.hljs.highlightElement(b));
  }

  // ── 마크다운 + 수식을 안전하게 변환 ─────────────────────
  // 핵심: 마크다운 변환기가 LaTeX의 백슬래시/underscore를 망가뜨리므로,
  //       (1) 코드와 수식을 먼저 빼내 보호하고 (2) 마크다운을 돌린 뒤 (3) 되돌린다.
  function renderMarkdown(md) {
    if (!window.marked) return `<pre>${Site.escapeHtml(md)}</pre>`;

    const codeStore = [];
    const mathStore = [];
    let s = md;

    // 1) 코드 보호 (코드 안의 $ 등은 수식으로 보지 않도록)
    s = s.replace(/```[\s\S]*?```/g, (m) => placeholder(codeStore, m, "CODE"));
    s = s.replace(/`[^`\n]*`/g, (m) => placeholder(codeStore, m, "CODE"));

    // 2) 수식 추출 → 미리 HTML로 렌더 ($$, \[ \] = 디스플레이 / \( \), $ = 인라인)
    if (window.katex) {
      s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => mathHtml(mathStore, t, true));
      s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => mathHtml(mathStore, t, true));
      s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_, t) => mathHtml(mathStore, t, false));
      s = s.replace(/\$([^\n$]+?)\$/g, (_, t) => mathHtml(mathStore, t, false));
    }

    // 3) 코드는 마크다운이 정상 처리하도록 먼저 되돌린다
    s = s.replace(/@@CODE(\d+)@@/g, (_, i) => codeStore[+i]);

    // 4) 마크다운 → HTML
    let html = window.marked.parse(s);

    // 5) 미리 렌더한 수식 HTML을 되돌린다 (토큰은 마크다운을 그대로 통과)
    html = html.replace(/@@MATH(\d+)@@/g, (_, i) => mathStore[+i]);
    return html;
  }

  function placeholder(store, value, kind) {
    store.push(value);
    return `@@${kind}${store.length - 1}@@`;
  }
  function mathHtml(store, tex, display) {
    let html;
    try {
      html = window.katex.renderToString(tex.trim(), { displayMode: display, throwOnError: false });
    } catch (e) {
      html = Site.escapeHtml((display ? "$$" : "$") + tex + (display ? "$$" : "$"));
    }
    store.push(html);
    return `@@MATH${store.length - 1}@@`;
  }
})();
