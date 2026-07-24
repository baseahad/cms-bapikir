import { NextResponse } from "next/server";
import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import { authorizeAdminRequest } from "@/lib/admin/middleware";
import { isSupportedMediaType, getMediaStoragePath } from "@/lib/storage/media-config";
import { getAllMedia, insertMediaRecord } from "@/lib/data/media";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  if (!hasServiceRoleEnv) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  const media = await getAllMedia();
  return NextResponse.json({ media });
}

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  if (!hasServiceRoleEnv) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Validasi tipe
    if (!isSupportedMediaType(file.type)) {
      return NextResponse.json(
        { error: `Tipe file ${file.type} tidak didukung. Gunakan JPG, PNG, WebP, GIF, SVG, atau PDF.` },
        { status: 400 }
      );
    }

    // Validasi ukuran (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File terlalu besar. Maksimal 10MB." }, { status: 400 });
    }

    // Upload ke Supabase Storage via admin client (bypass RLS)
    const admin = createAdminClient();
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const storagePath = getMediaStoragePath("admin", file.name);

    const { error: uploadError } = await admin.storage
      .from("media")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: "Gagal upload file. Coba lagi." }, { status: 500 });
    }

    // Simpan record ke tabel media
    const record = await insertMediaRecord({
      filename: storagePath.split("/").pop() || file.name,
      original_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      storage_path: storagePath,
      alt_text: "",
      user_id: auth.userId,
    });

    if (!record) {
      // Rollback: hapus dari storage kalo record gagal
      await admin.storage.from("media").remove([storagePath]);
      return NextResponse.json({ error: "Gagal menyimpan metadata" }, { status: 500 });
    }

    // Generate public URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const url = `${supabaseUrl}/storage/v1/object/public/media/${storagePath}`;

    return NextResponse.json({
      media: {
        id: record.id,
        filename: record.filename,
        original_name: record.original_name,
        mime_type: record.mime_type,
        size_bytes: record.size_bytes,
        alt_text: record.alt_text || "",
        created_at: record.created_at,
        url,
      },
    }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/media error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
