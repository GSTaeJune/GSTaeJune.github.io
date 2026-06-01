/* 논문 리뷰 목록 페이지: 검색 + 태그 필터 + "더 보기" 페이지네이션 */
(async function () {
  if (document.body.dataset.page !== "reviews") return;

  const PAGE_SIZE = 12; // 처음에 보여줄 개수 / "더 보기" 누를 때마다 늘어나는 단위

  const listEl = document.getElementById("reviews-list");
  const searchEl = document.getElementById("search");
  const tagbar = document.getElementById("tagbar");
  const countEl = document.getElementById("reviews-count");
  const moreWrap = document.getElementById("load-more-wrap");

  let items = [];
  let activeTag = null;
  let query = "";
  let shown = PAGE_SIZE; // 현재 화면에 보여주는 개수

  try {
    items = await Site.fetchJSON("./reviews/manifest.json");
  } catch (e) {
    listEl.innerHTML = `<p class="notice error">Could not load the list. When viewing locally, use the "Preview" method in the README (a small server).</p>`;
    return;
  }

  if (!items.length) {
    listEl.innerHTML = `<p class="notice">No reviews yet. Add a .md file to the <code>reviews/</code> folder and it will appear here.</p>`;
    if (tagbar) tagbar.style.display = "none";
    return;
  }

  // 태그 버튼 만들기
  const tags = [...new Set(items.flatMap((i) => i.tags || []))].sort((a, b) =>
    a.localeCompare(b)
  );
  function renderTagbar() {
    const btn = (label, value) =>
      `<button class="tag-btn ${activeTag === value ? "active" : ""}" data-tag="${value === null ? "" : Site.escapeHtml(value)}">${Site.escapeHtml(label)}</button>`;
    tagbar.innerHTML = btn("All", null) + tags.map((t) => btn("#" + t, t)).join("");
    tagbar.querySelectorAll(".tag-btn").forEach((b) => {
      b.addEventListener("click", () => {
        const v = b.dataset.tag;
        activeTag = v === "" ? null : v;
        shown = PAGE_SIZE; // 필터 바뀌면 처음부터 다시
        renderTagbar();
        render();
      });
    });
  }

  // 현재 검색어/태그로 걸러진 목록
  function getFiltered() {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (activeTag && !(it.tags || []).includes(activeTag)) return false;
      if (!q) return true;
      const hay = [it.title, it.authors, it.venue, it.summary, (it.tags || []).join(" ")]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  function render() {
    const filtered = getFiltered();

    if (!filtered.length) {
      listEl.innerHTML = `<p class="notice">No reviews match your filter.</p>`;
      countEl.textContent = "";
      moreWrap.innerHTML = "";
      return;
    }

    const visible = filtered.slice(0, shown);
    listEl.innerHTML = visible.map(Site.reviewCard).join("");

    // 개수 표시
    countEl.textContent =
      visible.length < filtered.length
        ? `Showing ${visible.length} of ${filtered.length} reviews`
        : `${filtered.length} review${filtered.length > 1 ? "s" : ""}`;

    // "더 보기" 버튼
    if (visible.length < filtered.length) {
      const remaining = filtered.length - visible.length;
      const next = Math.min(PAGE_SIZE, remaining);
      moreWrap.innerHTML = `<button class="btn" id="load-more">Load ${next} more (${remaining} left)</button>`;
      document.getElementById("load-more").addEventListener("click", () => {
        shown += PAGE_SIZE;
        render();
      });
    } else {
      moreWrap.innerHTML = "";
    }
  }

  if (searchEl) {
    searchEl.addEventListener("input", () => {
      query = searchEl.value;
      shown = PAGE_SIZE; // 검색이 바뀌면 처음부터 다시
      render();
    });
  }

  renderTagbar();
  render();
})();
