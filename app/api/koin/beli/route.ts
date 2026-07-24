import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { produk_slug } = await request.json();
  if (!produk_slug) {
    return NextResponse.json({ error: "produk_slug diperlukan." }, { status: 400 });
  }

  const supabase = await createClient();

  // Cari produk
  const { data: produk, error: produkError }: any = await supabase
    .from("produk" as any)
    .select("*")
    .eq("slug", produk_slug)
    .eq("status", "published")
    .single();

  if (produkError || !produk) {
    return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
  }

  // Produk gratis?
  if (produk.harga_koin === 0) {
    const { error: freeError }: any = await supabase
      .from("pembelian" as any)
      .insert({ user_id: user.id, produk_id: produk.id, tipe_koin: produk.koin_tipe, koin_terpakai: 0 });
    if (freeError) {
      return NextResponse.json({ error: "Gagal akses produk gratis." }, { status: 500 });
    }
    return NextResponse.json({ status: "success", produk: produk.nama, koin_terpakai: 0 });
  }

  // Panggil transaksi atomik via RPC
  const { data: result, error: rpcError }: any = await supabase.rpc("beli_produk" as any, {
    p_user_id: user.id,
    p_produk_id: produk.id,
    p_koin_tipe: produk.koin_tipe,
    p_harga_koin: produk.harga_koin,
    p_produk_slug: produk.slug,
  });

  if (rpcError) {
    return NextResponse.json({ error: "Gagal memproses pembelian." }, { status: 500 });
  }

  // Handle hasil RPC
  const status = result?.status;
  if (status === "duplicate") {
    return NextResponse.json({ error: "Produk sudah dibeli." }, { status: 409 });
  }
  if (status === "insufficient") {
    return NextResponse.json({
      error: `Saldo tidak cukup. Butuh ${produk.harga_koin} ${produk.koin_tipe === "bapikir" ? "Bp" : "Pt"}, sisa: ${result.saldo}`,
    }, { status: 402 });
  }
  if (status !== "success") {
    return NextResponse.json({ error: "Gagal memproses pembelian." }, { status: 500 });
  }

  return NextResponse.json({
    status: "success",
    produk: produk.nama,
    koin_terpakai: produk.harga_koin,
    sisa_saldo: result.saldo_setelah,
    akses_url: produk.url_konten || null,
  });
}
