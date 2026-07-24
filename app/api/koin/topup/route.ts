import { NextResponse } from "next/server";
import { getFeatureAvailability } from "@/lib/config/features";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { createClient } from "@/lib/supabase/server";
import { paymentConfig } from "@/config/payment";

export async function POST(request: Request) {
  const koinFeature = getFeatureAvailability("koin");
  if (!koinFeature.enabled) {
    return NextResponse.json({ error: koinFeature.message }, { status: 503 });
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tipe, produk, jumlah } = await request.json();

  // Validasi
  if (!["bapikir", "protokol"].includes(tipe)) {
    return NextResponse.json({ error: "Tipe koin tidak valid." }, { status: 400 });
  }
  if (!Number.isInteger(jumlah) || jumlah <= 0) {
    return NextResponse.json({ error: "Jumlah harus angka positif." }, { status: 400 });
  }
  if (tipe === "protokol" && !produk) {
    return NextResponse.json({ error: "Produk wajib diisi untuk koin protokol." }, { status: 400 });
  }

  const supabase = await createClient();

  // Cek pending request yang sama
  const { data: pending }: any = await supabase
    .from("koin_topup_requests" as any)
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  if (pending) {
    return NextResponse.json(
      { error: "Masih ada top-up pending. Selesaikan dulu." },
      { status: 409 }
    );
  }

  // Buat permintaan top-up — BELUM mengkredit saldo. Kredit hanya terjadi
  // lewat approve_koin_topup(), dipanggil admin setelah verifikasi bukti
  // transfer (lihat migrasi 20260723000001).
  const { data, error }: any = await supabase
    .from("koin_topup_requests" as any)
    .insert({
      user_id: user.id,
      tipe,
      produk: tipe === "bapikir" ? null : produk,
      jumlah,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Gagal buat top-up." }, { status: 500 });
  }

  return NextResponse.json({
    request_id: data.id,
    tipe,
    jumlah,
    status: "pending",
    rekening: {
      bank: paymentConfig.bankName,
      nomor: paymentConfig.bankAccountNumber,
      atas_nama: paymentConfig.bankAccountName,
      qris: paymentConfig.qrisImage,
    },
    message: `Transfer sesuai instruksi rekening, lalu kirim bukti transfer lewat POST /api/koin/konfirmasi.`,
  });
}
