import { NextResponse } from "next/server";
import { getFeatureAvailability } from "@/lib/config/features";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { getPendingManualPaymentForUser } from "@/lib/data/payments";
import {
  BUKTI_ALLOWED_TYPES,
  BUKTI_BUCKET,
  BUKTI_MAX_BYTES,
  getBuktiObjectPath,
  isSupportedBuktiType,
} from "@/lib/storage/bukti-config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const paymentsFeature = getFeatureAvailability("payments");
  if (!paymentsFeature.enabled) {
    return NextResponse.json({ error: paymentsFeature.message }, { status: 503 });
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const orderId = typeof body?.order_id === "string" ? body.order_id : "";
  const fileSize = typeof body?.fileSize === "number" ? body.fileSize : NaN;
  const fileType = typeof body?.fileType === "string" ? body.fileType.trim() : "";

  if (!orderId) {
    return NextResponse.json({ error: "order_id diperlukan." }, { status: 400 });
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

  const pending = await getPendingManualPaymentForUser(user.id);
  if (!pending || pending.external_id !== orderId) {
    return NextResponse.json(
      { error: "Order tidak ditemukan atau sudah diproses." },
      { status: 404 },
    );
  }

  const supabase = await createClient();
  const path = getBuktiObjectPath(user.id, orderId);
  const { data, error } = await supabase.storage
    .from(BUKTI_BUCKET)
    .createSignedUploadUrl(path, { upsert: true });

  if (error || !data) {
    console.error("payment_bukti_upload_url_error", error);
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
