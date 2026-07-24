import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveAIProvider } from "@/lib/config/features";
import { isProviderConfigured, type AIProvider } from "./provider";
import { checkUsageLimit, type Plan } from "./usage";

type AuthContext = {
  userId: string;
  email: string;
  plan: Plan;
};

export async function authorizeAIRequest(
  provider: AIProvider = resolveAIProvider()
): Promise<AuthContext | NextResponse> {
  if (!isProviderConfigured(provider)) {
    return NextResponse.json(
      { error: `AI provider "${provider}" is not configured` },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = authData.claims.sub as string;
  const email = authData.claims.email as string;

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", userId)
    .single();

  const plan: Plan = (subscription?.plan as Plan) ?? "FREE";

  const { allowed, used, limit } = await checkUsageLimit(userId, plan);
  if (!allowed) {
    return NextResponse.json(
      {
        error: "Monthly AI usage limit exceeded",
        used,
        limit,
        plan,
      },
      { status: 429 }
    );
  }

  return { userId, email, plan };
}
