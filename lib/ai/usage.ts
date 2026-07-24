import { createClient } from "@/lib/supabase/server";

export type Plan = "FREE" | "BASIC" | "PRO" | "ULTIMATE";

const TOKEN_LIMITS: Record<Plan, number> = {
  FREE: 0,
  BASIC: 10_000,
  PRO: 100_000,
  ULTIMATE: Infinity,
};

export async function trackUsage(
  userId: string,
  provider: string,
  model: string,
  promptTokens: number,
  completionTokens: number
) {
  const supabase = await createClient();
  await supabase.from("ai_usage").insert({
    user_id: userId,
    provider,
    model,
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
  });
}

export async function getMonthlyUsage(userId: string): Promise<number> {
  const supabase = await createClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("ai_usage")
    .select("prompt_tokens, completion_tokens")
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  if (!data) return 0;
  return data.reduce(
    (sum, row) => sum + (row.prompt_tokens ?? 0) + (row.completion_tokens ?? 0),
    0
  );
}

export async function checkUsageLimit(
  userId: string,
  plan: Plan
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const limit = TOKEN_LIMITS[plan];
  if (limit === Infinity) return { allowed: true, used: 0, limit };

  const used = await getMonthlyUsage(userId);
  return { allowed: used < limit, used, limit };
}
