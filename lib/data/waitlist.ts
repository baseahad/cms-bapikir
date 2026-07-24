import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

export type WaitlistRow = Database["public"]["Tables"]["waitlist"]["Row"];

export async function getAllWaitlistAdmin(): Promise<WaitlistRow[]> {
  if (!hasServiceRoleEnv) return [];

  const admin = createAdminClient();
  const { data } = await admin
    .from("waitlist")
    .select("id, email, name, wa, created_at")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function deleteWaitlistEntry(id: string): Promise<boolean> {
  if (!hasServiceRoleEnv) return false;

  const admin = createAdminClient();
  const { error } = await admin.from("waitlist").delete().eq("id", id);
  return !error;
}
