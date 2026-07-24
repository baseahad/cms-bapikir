import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { BUKTI_BUCKET } from "@/lib/storage/bukti-config";

export const BUKTI_SIGNED_URL_TTL_SECONDS = 60 * 10;

export async function createBuktiSignedUrl(
  path: string | null,
  options?: { useAdmin?: boolean },
) {
  if (!path) {
    return null;
  }

  const supabase =
    options?.useAdmin && hasServiceRoleEnv
      ? createAdminClient()
      : await createClient();
  const { data, error } = await supabase.storage
    .from(BUKTI_BUCKET)
    .createSignedUrl(path, BUKTI_SIGNED_URL_TTL_SECONDS);

  if (error) {
    return null;
  }

  return data.signedUrl;
}
