import { NextResponse } from "next/server";
import { hasServiceRoleEnv } from "@/lib/supabase/admin";
import { authorizeAdminRequest } from "@/lib/admin/middleware";
import { blogPostSchema } from "@/lib/validations";
import { getAllPostsAdmin, createPostAdmin, slugExists } from "@/lib/data/blog";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  if (!hasServiceRoleEnv) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  const posts = await getAllPostsAdmin();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  if (!hasServiceRoleEnv) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = blogPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const exists = await slugExists(parsed.data.slug);
    if (exists) {
      return NextResponse.json(
        { error: "Slug sudah digunakan. Gunakan slug lain." },
        { status: 409 }
      );
    }

    const post = await createPostAdmin(parsed.data);
    if (!post) {
      return NextResponse.json({ error: "Gagal membuat artikel" }, { status: 500 });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/blog error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
