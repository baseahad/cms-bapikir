import { NextResponse } from "next/server";
import matter from "gray-matter";
import { authorizeAdminRequest } from "@/lib/admin/middleware";
import { getCategorySlugs } from "@/config/blog-categories";

// Impor artikel .md/.mdx (Nizhom, ChatGPT, Notion, dll) ke form editor.
// Parsing dilakukan di server (bukan browser) karena gray-matter/js-yaml
// tak perlu dijadikan bagian bundle klien — dan biar validasi kategori
// terhadap taksonomi asli (config/blog-categories.ts) satu tempat saja.

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  let raw: string;
  try {
    const body = await request.json();
    raw = typeof body?.raw === "string" ? body.raw : "";
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!raw.trim()) {
    return NextResponse.json({ error: "Berkas kosong" }, { status: 400 });
  }

  let data: Record<string, unknown>;
  let content: string;
  try {
    const parsed = matter(raw);
    data = parsed.data;
    content = parsed.content.trim();
  } catch {
    return NextResponse.json({ error: "Gagal parse frontmatter — cek format YAML di bagian atas berkas" }, { status: 400 });
  }

  const validSlugs = getCategorySlugs();
  const rawCategory = typeof data.category === "string" ? data.category : "";
  const categoryValid = rawCategory ? validSlugs.includes(rawCategory) : false;

  const rawTags = data.tags;
  const tags = Array.isArray(rawTags) ? rawTags.filter((t): t is string => typeof t === "string") : [];

  return NextResponse.json({
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    content,
    author: typeof data.author === "string" ? data.author : "",
    tags,
    category: categoryValid ? rawCategory : "",
    categoryRaw: rawCategory,
    categoryValid,
    cover_image: typeof data.image === "string" ? data.image : (typeof data.cover_image === "string" ? data.cover_image : ""),
    reading_time: estimateReadingTime(content),
  });
}
