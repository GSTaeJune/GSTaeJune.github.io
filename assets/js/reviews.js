/* 논문 리뷰 목록 페이지: 검색 + 태그 필터 */
(async function () {
  if (document.body.dataset.page !== "reviews") return;

  const listEl = document.getElementById("reviews-list");
  const searchEl = document.getElementById("search");
  const tagbar = document.getElementById("tagbar");

  let items = [];
  let activeTag = null;
  let query = "";

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
        renderTagbar();
        render();
      });
    });
  }

  function render() {
    const q = query.trim().toLowerCase();
    const filtered = items.filter((it) => {
      if (activeTag && !(it.tags || []).includes(activeTag)) return false;
      if (!q) return true;
      const hay = [it.title, it.authors, it.venue, it.summary, (it.tags || []).join(" ")]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    if (!filtered.length) {
      listEl.innerHTML = `<p class="notice">No reviews match your filter.</p>`;
      return;
    }
    listEl.innerHTML = filtered.map(Site.reviewCard).join("");
  }

  if (searchEl) {
    searchEl.addEventListener("input", () => {
      query = searchEl.value;
      render();
    });
  }

  renderTagbar();
  render();
})();
