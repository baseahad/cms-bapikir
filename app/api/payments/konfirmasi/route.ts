import { NextResponse } from "next/server";
import { getFeatureAvailability } from "@/lib/config/features";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { attachManualPaymentProof } from "@/lib/data/payments";
import { manualPaymentProofSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const paymentsFeature = getFeatureAvailability("payments");
  if (!paymentsFeature.enabled) {
    return NextResponse.json({ error: paymentsFeature.message }, { status: 503 });
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = manualPaymentProofSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "bukti_path dan order_id diperlukan." }, { status: 400 });
  }

  const { order_id, bukti_path, bank, nama_pengirim, tanggal_transfer } = parsed.data;

  // Lampirkan bukti transfer ke order pending milik user sendiri. Ini TIDAK
  // mengubah status jadi PAID — attachManualPaymentProof() cuma menulis
  // kalau status masih PENDING; hanya admin (approveManualPayment, dipanggil
  // lewat authorizeAdminRequest) yang bisa mengaktifkan subscription.
  const payment = await attachManualPaymentProof(order_id, user.id, {
    bank,
    bukti_path,
    nama_pengirim,
    tanggal_transfer,
  });

  if (!payment) {
    return NextResponse.json(
      { error: "Order tidak ditemukan atau sudah diproses." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    message: "Bukti transfer diterima. Menunggu verifikasi admin sebelum plan aktif.",
    order_id: payment.external_id,
    status: "menunggu_verifikasi",
  });
}
