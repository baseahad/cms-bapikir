import { NextResponse } from "next/server";
import { getFeatureAvailability } from "@/lib/config/features";
import { getAuthenticatedUser } from "@/lib/data/auth";
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

  const { request_id, bank, nama_pengirim, tanggal_transfer, bukti_path } = await request.json();
  if (!request_id) {
    return NextResponse.json({ error: "request_id diperlukan." }, { status: 400 });
  }
  if (!bukti_path) {
    return NextResponse.json({ error: "bukti_path diperlukan — upload bukti transfer dulu." }, { status: 400 });
  }

  const supabase = await createClient();

  // Lampirkan bukti transfer ke permintaan pending milik user sendiri.
  // Ini TIDAK mengkredit saldo — RLS ("Users submit proof for own pending
  // request") memastikan status tetap 'pending' setelah update ini; hanya
  // admin (via approve_koin_topup) yang bisa mengubah status jadi 'approved'
  // dan menulis ke koin_ledger.
  const { data, error }: any = await supabase
    .from("koin_topup_requests" as any)
    .update({ bank, nama_pengirim, tanggal_transfer, bukti_path })
    .eq("id", request_id)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .select("id, status")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Permintaan top-up tidak ditemukan atau sudah diproses." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "menunggu_verifikasi",
    request_id: data.id,
    message: "Bukti transfer diterima. Menunggu verifikasi admin sebelum saldo bertambah.",
  });
}
