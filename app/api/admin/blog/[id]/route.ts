import { NextResponse } from "next/server";
import { hasServiceRoleEnv } from "@/lib/supabase/admin";
import { authorizeAdminRequest } from "@/lib/admin/middleware";
import { blogPostSchema } from "@/lib/validations";
import { getPostByIdAdmin, updatePostAdmin, deletePostAdmin, slugExists } from "@/lib/data/blog";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  if (!hasServiceRoleEnv) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  const { id } = await params;
  const post = await getPostByIdAdmin(id);
  if (!post) {
    return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  if (!hasServiceRoleEnv) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  try {
    const { id } = await params;

    // Check post exists
    const existing = await getPostByIdAdmin(id);
    if (!existing) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = blogPostSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check slug uniqueness if slug changed
    if (parsed.data.slug && parsed.data.slug !== existing.slug) {
      const exists = await slugExists(parsed.data.slug, id);
      if (exists) {
        return NextResponse.json(
          { error: "Slug sudah digunakan. Gunakan slug lain." },
          { status: 409 }
        );
      }
    }

    const updated = await updatePostAdmin(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Gagal mengupdate artikel" }, { status: 500 });
    }

    return NextResponse.json({ post: updated });
  } catch (err) {
    console.error("PUT /api/admin/blog/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  if (!hasServiceRoleEnv) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  const { id } = await params;

  const existing = await getPostByIdAdmin(id);
  if (!existing) {
    return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  const ok = await deletePostAdmin(id);
  if (!ok) {
    return NextResponse.json({ error: "Gagal menghapus artikel" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
