import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { activateSubscriptionForPayment } from "@/lib/data/subscriptions";
import { createBuktiSignedUrl } from "@/lib/storage/bukti";
import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import type { Database, InsertDto, Row } from "@/types/database";

export type PaymentRecord = Row<"payments">;
type PaymentInsertError = {
  message?: string;
} | null;
type PaymentSummary = Pick<
  PaymentRecord,
  | "amount"
  | "bukti_path"
  | "created_at"
  | "external_id"
  | "paid_at"
  | "plan"
  | "provider"
  | "status"
  | "user_id"
>;

export async function createPaymentRecord(
  input: InsertDto<"payments">,
): Promise<{ error: PaymentInsertError }> {
  if (!hasServiceRoleEnv) {
    return {
      error: new Error("SUPABASE_SERVICE_ROLE_KEY is not set"),
    };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("payments").insert(input);
  return { error };
}

export async function updatePaymentByExternalId(
  externalId: string,
  input: Partial<PaymentRecord>,
): Promise<PostgrestSingleResponse<PaymentRecord>> {
  if (!hasServiceRoleEnv) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  const adminClient = createAdminClient();

  return adminClient
    .from("payments")
    .update(input)
    .eq("external_id", externalId)
    .select("*")
    .single();
}

export async function getPaymentByExternalId(externalId: string): Promise<PaymentRecord | null> {
  if (!hasServiceRoleEnv) {
    return null;
  }

  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("payments")
    .select("*")
    .eq("external_id", externalId)
    .maybeSingle();

  return data;
}

export async function getRecentPaymentsForUser(
  supabase: SupabaseClient<Database>,
  userId: string,
  limit = 5,
): Promise<
  Pick<
    PaymentRecord,
    "amount" | "created_at" | "external_id" | "paid_at" | "plan" | "provider" | "status" | "id"
  >[]
> {
  const { data } = await supabase
    .from("payments")
    .select("id, external_id, amount, status, provider, created_at, paid_at, plan")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getOrderSummary(orderId: string): Promise<PaymentSummary | null> {
  if (!hasServiceRoleEnv) {
    return null;
  }

  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("payments")
    .select("external_id, amount, status, provider, paid_at, created_at, plan, bukti_path, user_id")
    .eq("external_id", orderId)
    .maybeSingle();

  return data;
}

export async function getPendingManualPaymentForUser(
  userId: string,
): Promise<PaymentRecord | null> {
  if (!hasServiceRoleEnv) return null;

  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "MANUAL")
    .eq("status", "PENDING")
    .maybeSingle();

  return data;
}

export async function attachManualPaymentProof(
  externalId: string,
  userId: string,
  proof: { bank?: string; nama_pengirim?: string; tanggal_transfer?: string; bukti_path: string },
): Promise<PaymentRecord | null> {
  if (!hasServiceRoleEnv) return null;

  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("payments")
    .update(proof)
    .eq("external_id", externalId)
    .eq("user_id", userId)
    .eq("provider", "MANUAL")
    .eq("status", "PENDING")
    .select("*")
    .maybeSingle();

  return data;
}

export type ManualPaymentForAdmin = PaymentRecord & {
  email: string;
  bukti_signed_url: string | null;
};

export async function listPendingManualPaymentsForAdmin(): Promise<ManualPaymentForAdmin[]> {
  if (!hasServiceRoleEnv) return [];

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("payments")
    .select("*")
    .eq("provider", "MANUAL")
    .eq("status", "PENDING")
    .order("created_at", { ascending: true });

  if (error) throw error;
  const payments = data ?? [];
  if (payments.length === 0) return [];

  const uniqueUserIds = Array.from(new Set(payments.map((p) => p.user_id)));
  const emailByUserId = new Map<string, string>();

  await Promise.all(
    uniqueUserIds.map(async (userId) => {
      const { data: userData } = await adminClient.auth.admin.getUserById(userId);
      emailByUserId.set(userId, userData?.user?.email ?? "unknown@user.local");
    }),
  );

  return Promise.all(
    payments.map(async (payment) => ({
      ...payment,
      email: emailByUserId.get(payment.user_id) ?? "unknown@user.local",
      bukti_signed_url: await createBuktiSignedUrl(payment.bukti_path, { useAdmin: true }),
    })),
  );
}

export async function approveManualPayment(
  externalId: string,
  adminId: string,
): Promise<{ status: string; currentPeriodEnd?: string }> {
  if (!hasServiceRoleEnv) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  const adminClient = createAdminClient();
  const paidAt = new Date();

  const { data: payment, error } = await adminClient
    .from("payments")
    .update({
      metadata: { reviewed_by: adminId, reviewed_at: paidAt.toISOString() },
      paid_at: paidAt.toISOString(),
      status: "PAID",
      updated_at: paidAt.toISOString(),
    })
    .eq("external_id", externalId)
    .eq("provider", "MANUAL")
    .eq("status", "PENDING")
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!payment) {
    return { status: "not_found_or_already_reviewed" };
  }

  const { currentPeriodEnd } = await activateSubscriptionForPayment(
    payment.user_id,
    payment.plan,
    paidAt,
  );

  return { status: "success", currentPeriodEnd };
}

export async function rejectManualPayment(
  externalId: string,
  adminId: string,
  catatan: string,
): Promise<{ status: string }> {
  if (!hasServiceRoleEnv) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  const adminClient = createAdminClient();
  const reviewedAt = new Date().toISOString();

  const { data: payment, error } = await adminClient
    .from("payments")
    .update({
      metadata: { reject_reason: catatan, reviewed_at: reviewedAt, reviewed_by: adminId },
      status: "FAILED",
      updated_at: reviewedAt,
    })
    .eq("external_id", externalId)
    .eq("provider", "MANUAL")
    .eq("status", "PENDING")
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!payment) {
    return { status: "not_found_or_already_reviewed" };
  }

  return { status: "success" };
}
