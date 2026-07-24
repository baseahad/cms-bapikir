// check-artikel.mjs — linter mekanis untuk artikel blog avathur.id
// Cek gaya (STYLE-GUIDE) + rem-tangan fakta (FACT-PROTOCOL).
// Pakai: node scripts/check-artikel.mjs [path-file-atau-folder]
// Default: content/blog. Exit code 1 kalau ada ERROR (bukan sekadar WARN).

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOT = process.cwd();
const target = process.argv[2] || "content/blog";

// ---- Aturan ----
// ERROR = wajib dibetulkan sebelum publish. WARN = perlu dilirik.
const RULES = [
  {
    id: "gue-lo",
    level: "ERROR",
    re: /\b(gue|gw|lo|lu|elo)\b/gi,
    msg: 'Kata "gue/lo" dilarang di konten publik. Ganti Saya/Anda.',
  },
  {
    id: "em-en-dash",
    level: "ERROR",
    re: /[—–]/g,
    msg: "Em/en dash (—, –) terlarang. Pakai tanda hubung biasa atau susun ulang.",
  },
  {
    id: "verify-tag",
    level: "ERROR",
    re: /\[VERIFY\b/gi,
    msg: "Masih ada tag [VERIFY]. Verifikasi & hapus sebelum published: true.",
  },
  {
    id: "kamu-blog",
    level: "WARN",
    re: /\b(kamu|kamumu)\b/gi,
    msg: 'Kata "kamu" di blog (Ring Luar) — pastikan bukan seharusnya "Anda".',
  },
  {
    id: "kita-menggurui",
    level: "WARN",
    re: /\bkita (harus|wajib|perlu|jangan|mesti)\b/gi,
    msg: '"kita harus/jangan…" bisa terkesan menggurui di blog. Timbang ganti ke Anda.',
  },
];

// Frontmatter yang wajib ada
const REQUIRED_FM = ["title", "description", "date", "slug"];

function walk(p) {
  const abs = join(ROOT, p);
  const st = statSync(abs);
  if (st.isFile()) return [abs];
  return readdirSync(abs)
    .flatMap((f) => walk(join(p, f)))
    .filter((f) => [".mdx", ".md"].includes(extname(f)));
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { fm: null, body: text, published: false };
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  const published = /published:\s*true/.test(m[1]);
  return { fm, body: text.slice(m[0].length), published };
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

let errors = 0;
let warns = 0;
const files = walk(target);

for (const file of files) {
  const rel = relative(ROOT, file);
  const text = readFileSync(file, "utf8");
  const { fm, published } = parseFrontmatter(text);
  const hits = [];

  // Frontmatter check
  if (!fm) {
    hits.push({ level: "ERROR", line: 1, msg: "Frontmatter (--- ... ---) tidak ditemukan." });
  } else {
    for (const key of REQUIRED_FM) {
      if (!(key in fm)) hits.push({ level: "ERROR", line: 1, msg: `Frontmatter wajib "${key}" hilang.` });
    }
  }

  // Rule checks
  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    let m;
    while ((m = rule.re.exec(text)) !== null) {
      // Skip [VERIFY] rule only-fires-if-published? No: always flag, but ERROR weight only if published.
      const level = rule.id === "verify-tag" && !published ? "WARN" : rule.level;
      hits.push({ level, line: lineOf(text, m.index), msg: `[${rule.id}] ${rule.msg} → "${m[0]}"` });
    }
  }

  if (hits.length) {
    console.log(`\n${rel}${published ? "  (published)" : ""}`);
    for (const h of hits.sort((a, b) => a.line - b.line)) {
      const tag = h.level === "ERROR" ? "  ✗ ERROR" : "  · warn ";
      console.log(`${tag} L${h.line}: ${h.msg}`);
      if (h.level === "ERROR") errors++;
      else warns++;
    }
  }
}

console.log(`\n─────────────────────────────`);
console.log(`Diperiksa: ${files.length} file  |  ERROR: ${errors}  |  WARN: ${warns}`);
if (errors > 0) {
  console.log("Ada ERROR — betulkan sebelum publish.");
  process.exit(1);
}
console.log("Bersih dari ERROR. ✓");
