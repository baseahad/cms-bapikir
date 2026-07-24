import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Ambil semua mutasi user, hitung saldo per tipe+produk
  const { data, error }: any = await supabase
    .from("koin_ledger" as any)
    .select("tipe, produk, mutasi")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Gagal ambil saldo." }, { status: 500 });
  }

  // Hitung saldo
  const balance: Record<string, number | Record<string, number>> = {};

  for (const row of data || []) {
    if (row.tipe === "bapikir") {
      balance.bapikir = (balance.bapikir as number || 0) + row.mutasi;
    } else if (row.tipe === "protokol") {
      if (!balance.protokol) balance.protokol = {};
      const proto = balance.protokol as Record<string, number>;
      const key = row.produk || "umum";
      proto[key] = (proto[key] || 0) + row.mutasi;
    }
  }

  // Default 0
  if (!balance.bapikir) balance.bapikir = 0;
  if (!balance.protokol) balance.protokol = {};

  return NextResponse.json(balance);
}
