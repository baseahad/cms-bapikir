import { NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { authorizeAdminRequest } from "@/lib/admin/middleware";

// Kompilasi MDX dilakukan di server (sama seperti tampilan publik,
// app/(marketing)/blog/[slug]/page.tsx) lalu hasilnya dihidrasi di klien
// lewat next-mdx-remote (bukan /rsc) — supaya pratinjau di editor
// benar-benar sama dengan yang akan dilihat pembaca, bukan pendekatan.

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  let content: string;
  try {
    const body = await request.json();
    content = typeof body?.content === "string" ? body.content : "";
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!content.trim()) {
    return NextResponse.json({ mdxSource: null });
  }

  try {
    const mdxSource = await serialize(content, {
      mdxOptions: { remarkPlugins: [remarkGfm] },
    });
    return NextResponse.json({ mdxSource });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal render MDX";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
