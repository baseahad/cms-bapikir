import { NextResponse } from "next/server";
import { getFeatureAvailabilityMap } from "@/lib/config/features";
import { hasSupabasePublicEnv } from "@/lib/config/public-features";
import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";

type HealthCheck = {
  latency_ms: number | null;
  ok: boolean | null;
};

export async function GET() {
  const features = getFeatureAvailabilityMap();
  const checks = {
    resend: Boolean(process.env.RESEND_API_KEY),
    supabase_public: hasSupabasePublicEnv,
    supabase_service_role: hasServiceRoleEnv,
  };

  const database: HealthCheck = {
    latency_ms: null,
    ok: null,
  };

  const needsDatabaseCheck = features.admin.enabled || features.payments.enabled;

  if (needsDatabaseCheck && hasServiceRoleEnv) {
    const startedAt = Date.now();
    const { error } = await createAdminClient()
      .from("profiles")
      .select("id", { head: true })
      .limit(1);

    database.latency_ms = Date.now() - startedAt;
    database.ok = !error;
  }

  const hasMissingConfig = Object.values(features).some(
    (feature) => !feature.enabled && !feature.disabledByFlag,
  );
  const status = !hasMissingConfig && (database.ok === null || database.ok)
    ? "ok"
    : "degraded";

  return NextResponse.json(
    {
      checks,
      database,
      features: Object.fromEntries(
        Object.entries(features).map(([key, feature]) => [
          key,
          {
            disabled_by_flag: feature.disabledByFlag,
            enabled: feature.enabled,
            message: feature.message,
            missing_env: feature.missingEnv,
          },
        ]),
      ),
      status,
      timestamp: new Date().toISOString(),
    },
    {
      status: status === "ok" ? 200 : 503,
    },
  );
}
