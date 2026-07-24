import { NextResponse } from "next/server";
import { getFeatureAvailability } from "@/lib/config/features";
import { getAuthenticatedUser } from "@/lib/data/auth";
import {
  AVATAR_ALLOWED_TYPES,
  AVATAR_BUCKET,
  AVATAR_MAX_BYTES,
  getAvatarObjectPath,
  isSupportedAvatarType,
} from "@/lib/storage/avatar-config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const authFeature = getFeatureAvailability("auth");
  if (!authFeature.enabled) {
    return NextResponse.json({ error: authFeature.message }, { status: 503 });
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const fileSize = typeof body?.fileSize === "number" ? body.fileSize : NaN;
  const fileType = typeof body?.fileType === "string" ? body.fileType.trim() : "";

  if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > AVATAR_MAX_BYTES) {
    return NextResponse.json(
      { error: "Ukuran avatar maksimal 2MB." },
      { status: 400 },
    );
  }

  if (!isSupportedAvatarType(fileType)) {
    return NextResponse.json(
      {
        error: `Format avatar harus salah satu dari: ${AVATAR_ALLOWED_TYPES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const path = getAvatarObjectPath(user.id);
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUploadUrl(path, {
      upsert: true,
    });

  if (error || !data) {
    console.error("avatar_upload_url_error", error);
    return NextResponse.json(
      { error: "Gagal menyiapkan upload avatar." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    bucket: AVATAR_BUCKET,
    path: data.path,
    token: data.token,
  });
}
