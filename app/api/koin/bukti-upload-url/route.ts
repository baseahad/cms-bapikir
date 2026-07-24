import { NextResponse } from "next/server";
import { getFeatureAvailability } from "@/lib/config/features";
import { getAuthenticatedUser } from "@/lib/data/auth";
import {
  BUKTI_ALLOWED_TYPES,
  BUKTI_BUCKET,
  BUKTI_MAX_BYTES,
  getBuktiObjectPath,
  isSupportedBuktiType,
} from "@/lib/storage/bukti-config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const koinFeature = getFeatureAvailability("koin");
  if (!koinFeature.enabled) {
    return NextResponse.json({ error: koinFeature.message }, { status: 503 });
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const requestId = typeof body?.request_id === "string" ? body.request_id : "";
  const fileSize = typeof body?.fileSize === "number" ? body.fileSize : NaN;
  const fileType = typeof body?.fileType === "string" ? body.fileType.trim() : "";

  if (!requestId) {
    return NextResponse.json({ error: "request_id diperlukan." }, { status: 400 });
  }

  if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > BUKTI_MAX_BYTES) {
    return NextResponse.json(
      { error: "Ukuran bukti transfer maksimal 5MB." },
      { status: 400 },
    );
  }

  if (!isSupportedBuktiType(fileType)) {
    return NextResponse.json(
      { error: `Format bukti harus salah satu dari: ${BUKTI_ALLOWED_TYPES.join(", ")}` },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // Pastikan request memang pending & milik user ini sebelum kasih akses upload.
  const { data: pending, error: pendingError }: any = await supabase
    .from("koin_topup_requests" as any)
    .select("id")
    .eq("id", requestId)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  if (pendingError || !pending) {
    return NextResponse.json(
      { error: "Permintaan top-up tidak ditemukan atau sudah diproses." },
      { status: 404 },
    );
  }

  const path = getBuktiObjectPath(user.id, requestId);
  const { data, error } = await supabase.storage
    .from(BUKTI_BUCKET)
    .createSignedUploadUrl(path, { upsert: true });

  if (error || !data) {
    console.error("bukti_upload_url_error", error);
    return NextResponse.json(
      { error: "Gagal menyiapkan upload bukti transfer." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    bucket: BUKTI_BUCKET,
    path: data.path,
    token: data.token,
  });
}
