import { authFeatureEnabled } from "@/lib/config/public-features";
import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { DbEnum } from "@/types/database";

export type AppRole = DbEnum<"app_role">;

function getLegacyAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export async function getUserRoleForCurrentUser(
  userId: string,
  email: string,
): Promise<AppRole> {
  if (!authFeatureEnabled) {
    return getLegacyAdminEmails().includes(email.toLowerCase()) ? "admin" : "member";
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (data?.role) {
    return data.role;
  }

  const isLegacyAdmin = getLegacyAdminEmails().includes(email.toLowerCase());
  if (!isLegacyAdmin) {
    return "member";
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || error) {
    return "admin";
  }

  try {
    const adminClient = createAdminClient();
    await adminClient.from("user_roles").upsert({
      role: "admin",
      updated_at: new Date().toISOString(),
      user_id: userId,
    });
  } catch {
    return "admin";
  }

  return "admin";
}

export async function isAdminUser(userId: string, email: string) {
  return (await getUserRoleForCurrentUser(userId, email)) === "admin";
}

export async function setUserRoleForUser(userId: string, role: AppRole) {
  if (!hasServiceRoleEnv) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  const adminClient = createAdminClient();
  return adminClient.from("user_roles").upsert({
    role,
    updated_at: new Date().toISOString(),
    user_id: userId,
  });
}
