import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createBuktiSignedUrl } from "@/lib/storage/bukti";

export type KoinTopupRequest = {
  id: string;
  user_id: string;
  tipe: "bapikir" | "protokol";
  produk: string | null;
  jumlah: number;
  bank: string | null;
  nama_pengirim: string | null;
  tanggal_transfer: string | null;
  bukti_path: string | null;
  status: "pending" | "approved" | "rejected";
  catatan: string | null;
  created_at: string;
};

export async function getKoinBalance(userId: string, tipe: "bapikir" | "protokol" = "bapikir"): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("koin_ledger" as any)
    .select("mutasi")
    .eq("user_id", userId)
    .eq("tipe", tipe);

  if (error) throw error;
  return ((data || []) as unknown as { mutasi: number }[]).reduce((sum, row) => sum + row.mutasi, 0);
}

export type KoinLedgerEntry = {
  id: string;
  tipe: "bapikir" | "protokol";
  produk: string | null;
  mutasi: number;
  saldo_setelah: number;
  keterangan: string | null;
  created_at: string;
};

export async function getKoinLedgerHistory(
  userId: string,
  tipe: "bapikir" | "protokol" = "bapikir",
  limit = 20,
): Promise<KoinLedgerEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("koin_ledger" as any)
    .select("id, tipe, produk, mutasi, saldo_setelah, keterangan, created_at")
    .eq("user_id", userId)
    .eq("tipe", tipe)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as unknown as KoinLedgerEntry[];
}

export async function getMyPendingTopupRequest(userId: string): Promise<KoinTopupRequest | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("koin_topup_requests" as any)
    .select("*")
    .eq("user_id", userId)
    .eq("status", "pending")
    .maybeSingle();

  if (error) throw error;
  return data as unknown as KoinTopupRequest | null;
}

export async function listPendingTopupRequests(): Promise<KoinTopupRequest[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("koin_topup_requests" as any)
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as KoinTopupRequest[];
}

export type KoinTopupRequestForAdmin = KoinTopupRequest & {
  email: string;
  bukti_signed_url: string | null;
};

export async function listPendingTopupRequestsForAdmin(): Promise<KoinTopupRequestForAdmin[]> {
  const requests = await listPendingTopupRequests();
  if (requests.length === 0) return [];

  const supabase = createAdminClient();
  const uniqueUserIds = Array.from(new Set(requests.map((r) => r.user_id)));
  const emailByUserId = new Map<string, string>();

  await Promise.all(
    uniqueUserIds.map(async (userId) => {
      const { data } = await supabase.auth.admin.getUserById(userId);
      emailByUserId.set(userId, data?.user?.email ?? "unknown@user.local");
    }),
  );

  return Promise.all(
    requests.map(async (request) => ({
      ...request,
      email: emailByUserId.get(request.user_id) ?? "unknown@user.local",
      bukti_signed_url: await createBuktiSignedUrl(request.bukti_path, { useAdmin: true }),
    })),
  );
}

export async function approveTopupRequest(requestId: string, adminId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("approve_koin_topup" as any, {
    p_request_id: requestId,
    p_admin_id: adminId,
  });

  if (error) throw error;
  return data as { status: string; saldo_setelah?: number };
}

export async function rejectTopupRequest(requestId: string, adminId: string, catatan: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("reject_koin_topup" as any, {
    p_request_id: requestId,
    p_admin_id: adminId,
    p_catatan: catatan,
  });

  if (error) throw error;
  return data as { status: string };
}
