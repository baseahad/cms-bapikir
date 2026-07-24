import type { User } from "@supabase/supabase-js";
import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import type { PaymentRecord } from "@/lib/data/payments";
import type { AppRole } from "@/lib/data/user-roles";
import { resolveProfileAvatarUrl } from "@/lib/storage/avatars";
import type { Database } from "@/types/database";

type AdminMetrics = Database["public"]["Functions"]["admin_payment_metrics"]["Returns"][number];
type AdminRevenueRow = Database["public"]["Functions"]["admin_revenue_by_day"]["Returns"][number];
type AdminPaymentRow = Pick<
  PaymentRecord,
  "id" | "amount" | "created_at" | "external_id" | "plan" | "provider" | "status"
>;
type AdminSubscriptionRow = Pick<
  Database["public"]["Tables"]["subscriptions"]["Row"],
  "current_period_end" | "plan" | "status" | "user_id"
>;
type AdminRoleRow = Database["public"]["Tables"]["user_roles"]["Row"];
type AdminProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "avatar_path" | "avatar_url" | "created_at" | "full_name" | "id"
>;
type AdminUserPaymentRow = Pick<
  PaymentRecord,
  "amount" | "created_at" | "id" | "provider" | "status" | "user_id"
>;

export type AdminUserRecord = {
  avatar_image_url: string | null;
  created_at: string;
  current_period_end: string | null;
  email: string;
  full_name: string | null;
  id: string;
  payments: Omit<AdminUserPaymentRow, "user_id">[];
  plan: AdminSubscriptionRow["plan"];
  role: AppRole;
  status: AdminSubscriptionRow["status"];
};

async function listAllAdminUsers() {
  const adminClient = createAdminClient();
  const users: User[] = [];
  let page = 1;
  const perPage = 200;

  while (page <= 5) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    users.push(...data.users);

    if (!data.nextPage) {
      break;
    }

    page = data.nextPage;
  }

  return users;
}

export async function getAdminMetrics(): Promise<AdminMetrics | null> {
  if (!hasServiceRoleEnv) {
    return null;
  }

  const adminClient = createAdminClient();
  const { data } = await adminClient.rpc("admin_payment_metrics");
  return data?.[0] ?? null;
}

export async function getAdminRevenueByDay(daysBack = 14): Promise<AdminRevenueRow[]> {
  if (!hasServiceRoleEnv) {
    return [];
  }

  const adminClient = createAdminClient();
  const { data } = await adminClient.rpc("admin_revenue_by_day", {
    days_back: daysBack,
  });

  return data ?? [];
}

export async function getAdminPaymentsPage(
  page: number,
  pageSize: number,
): Promise<{
  payments: AdminPaymentRow[];
  total: number;
}> {
  if (!hasServiceRoleEnv) {
    return {
      payments: [],
      total: 0,
    };
  }

  const adminClient = createAdminClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { count, data } = await adminClient
    .from("payments")
    .select("id, amount, status, provider, external_id, created_at, plan", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  return {
    payments: data ?? [],
    total: count ?? 0,
  };
}

export async function getAdminUsers(): Promise<AdminUserRecord[]> {
  if (!hasServiceRoleEnv) {
    return [];
  }

  const adminClient = createAdminClient();
  const users = await listAllAdminUsers();
  if (users.length === 0) {
    return [];
  }

  const userIds = users.map((user) => user.id);
  const [{ data: profiles }, { data: subscriptions }, { data: roles }, { data: payments }] =
    await Promise.all([
      adminClient
        .from("profiles")
        .select("id, full_name, avatar_url, avatar_path, created_at")
        .in("id", userIds),
      adminClient
        .from("subscriptions")
        .select("user_id, plan, status, current_period_end")
        .in("user_id", userIds),
      adminClient.from("user_roles").select("*").in("user_id", userIds),
      adminClient
        .from("payments")
        .select("id, amount, status, provider, created_at, user_id")
        .in("user_id", userIds)
        .order("created_at", { ascending: false }),
    ]);

  const profileMap = new Map<string, AdminProfileRow>(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );
  const subscriptionMap = new Map<string, AdminSubscriptionRow>(
    (subscriptions ?? []).map((subscription) => [subscription.user_id, subscription]),
  );
  const roleMap = new Map<string, AdminRoleRow>(
    (roles ?? []).map((role) => [role.user_id, role]),
  );
  const paymentMap = new Map<string, Omit<AdminUserPaymentRow, "user_id">[]>();

  for (const payment of payments ?? []) {
    const userPayments = paymentMap.get(payment.user_id) ?? [];
    if (userPayments.length < 5) {
      userPayments.push({
        amount: payment.amount,
        created_at: payment.created_at,
        id: payment.id,
        provider: payment.provider,
        status: payment.status,
      });
    }
    paymentMap.set(payment.user_id, userPayments);
  }

  const records = await Promise.all(
    users.map(async (user) => {
      const profile = profileMap.get(user.id);
      const subscription = subscriptionMap.get(user.id);
      const role = roleMap.get(user.id);

      return {
        avatar_image_url: await resolveProfileAvatarUrl(
          {
            avatar_path: profile?.avatar_path ?? null,
            avatar_url: profile?.avatar_url ?? null,
          },
          { useAdmin: true },
        ),
        created_at: user.created_at ?? profile?.created_at ?? new Date().toISOString(),
        current_period_end: subscription?.current_period_end ?? null,
        email: user.email ?? "unknown@user.local",
        full_name: profile?.full_name ?? null,
        id: user.id,
        payments: paymentMap.get(user.id) ?? [],
        plan: subscription?.plan ?? "FREE",
        role: role?.role ?? "member",
        status: subscription?.status ?? "ACTIVE",
      } satisfies AdminUserRecord;
    }),
  );

  return records.toSorted(
    (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );
}
