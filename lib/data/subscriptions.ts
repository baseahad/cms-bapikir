import type { SupabaseClient } from "@supabase/supabase-js";
import { getPlanPeriodEnd } from "@/config/subscriptions";
import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import type { Database, Row } from "@/types/database";

export type SubscriptionRecord = Row<"subscriptions">;

export function isPaidPlan(plan: SubscriptionRecord["plan"]) {
  return plan !== "FREE";
}

export function isProPlan(plan: SubscriptionRecord["plan"]) {
  return plan === "PRO" || plan === "ULTIMATE";
}

export async function getSubscriptionByUserId(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<SubscriptionRecord | null> {
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return data;
}

export async function syncExpiredSubscription(userId: string): Promise<SubscriptionRecord | null> {
  if (!hasServiceRoleEnv) {
    return null;
  }

  const adminClient = createAdminClient();
  const subscription = await getSubscriptionByUserId(adminClient, userId);

  if (!subscription || !isPaidPlan(subscription.plan) || !subscription.current_period_end) {
    return subscription;
  }

  const hasExpired = new Date(subscription.current_period_end).getTime() <= Date.now();

  if (!hasExpired) {
    return subscription;
  }

  const downgraded = {
    cancel_at_period_end: false,
    canceled_at: subscription.cancel_at_period_end
      ? subscription.canceled_at ?? new Date().toISOString()
      : subscription.canceled_at,
    current_period_end: null,
    current_period_start: null,
    plan: "FREE" as const,
    status: "ACTIVE" as const,
    updated_at: new Date().toISOString(),
  };

  await adminClient
    .from("subscriptions")
    .update(downgraded)
    .eq("user_id", userId);

  return {
    ...subscription,
    ...downgraded,
  };
}

export async function activateSubscriptionForPayment(
  userId: string,
  plan: SubscriptionRecord["plan"],
  paidAt = new Date(),
): Promise<{
  currentPeriodEnd: string;
  currentPeriodStart: string;
}> {
  if (!hasServiceRoleEnv) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  const currentPeriodStart = paidAt.toISOString();
  const currentPeriodEnd = getPlanPeriodEnd(paidAt).toISOString();

  const adminClient = createAdminClient();
  await adminClient
    .from("subscriptions")
    .update({
      cancel_at_period_end: false,
      canceled_at: null,
      current_period_end: currentPeriodEnd,
      current_period_start: currentPeriodStart,
      plan,
      status: "ACTIVE",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  return {
    currentPeriodEnd,
    currentPeriodStart,
  };
}

export async function cancelSubscriptionAtPeriodEnd(userId: string) {
  if (!hasServiceRoleEnv) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  const adminClient = createAdminClient();
  const canceledAt = new Date().toISOString();

  await adminClient
    .from("subscriptions")
    .update({
      cancel_at_period_end: true,
      canceled_at: canceledAt,
      updated_at: canceledAt,
    })
    .eq("user_id", userId);

  return canceledAt;
}

export async function resumeSubscription(userId: string) {
  if (!hasServiceRoleEnv) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  const adminClient = createAdminClient();
  const updatedAt = new Date().toISOString();

  await adminClient
    .from("subscriptions")
    .update({
      cancel_at_period_end: false,
      canceled_at: null,
      updated_at: updatedAt,
    })
    .eq("user_id", userId);
}
