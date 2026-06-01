// =========================================================
// reviews/ 폴더의 .md 파일을 스캔해서 목록(manifest.json)을 만듭니다.
// 외부 패키지가 전혀 필요 없습니다. (Node.js만 있으면 동작)
//
// 직접 실행:  node scripts/build.mjs
// 보통은 GitHub에 올릴 때 자동으로 실행되므로 직접 실행할 필요는 없습니다.
// =========================================================
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const reviewsDir = join(__dirname, "..", "reviews");
const outFile = join(reviewsDir, "manifest.json");

// 따옴표("..." 또는 '...') 벗기기
function stripQuotes(s) {
  if (s.length >= 2) {
    const a = s[0], b = s[s.length - 1];
    if ((a === '"' && b === '"') || (a === "'" && b === "'")) return s.slice(1, -1);
  }
  return s;
}

// 파일 맨 위 --- ... --- 사이의 머리말(front matter)을 읽어 객체로 변환
function parseFrontMatter(text) {
  const m = /^﻿?---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/.exec(text);
  const meta = {};
  if (!m) return { meta, body: text };
  for (const raw of m[1].split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      meta[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => stripQuotes(s.trim()))
        .filter(Boolean);
    } else {
      meta[key] = stripQuotes(val);
    }
  }
  return { meta, body: text.slice(m[0].length) };
}

function build() {
  let files = [];
  try {
    files = readdirSync(reviewsDir).filter((f) => f.toLowerCase().endsWith(".md"));
  } catch {
    console.error(`reviews 폴더를 찾을 수 없습니다: ${reviewsDir}`);
  }

  const items = files.map((file) => {
    const text = readFileSync(join(reviewsDir, file), "utf8");
    const { meta } = parseFrontMatter(text);
    const id = basename(file, ".md");
    return {
      id,
      title: meta.title || id,
      date: meta.date || "",
      authors: meta.authors || "",
      venue: meta.venue || "",
      link: meta.link || "",
      summary: meta.summary || "",
      tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
    };
  });

  // 날짜 내림차순(최신 먼저). 날짜 없는 글은 맨 뒤로.
  items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  writeFileSync(outFile, JSON.stringify(items, null, 2) + "\n", "utf8");
  console.log(`✓ 리뷰 ${items.length}개를 정리했습니다 → reviews/manifest.json`);
}

build();
