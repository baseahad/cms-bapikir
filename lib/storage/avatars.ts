import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  AVATAR_BUCKET,
} from "@/lib/storage/avatar-config";
export const AVATAR_SIGNED_URL_TTL_SECONDS = 60 * 60;

export async function createAvatarSignedUrl(
  path: string | null,
  options?: {
    useAdmin?: boolean;
  },
) {
  if (!path) {
    return null;
  }

  const supabase =
    options?.useAdmin && hasServiceRoleEnv
      ? createAdminClient()
      : await createClient();
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(path, AVATAR_SIGNED_URL_TTL_SECONDS);

  if (error) {
    return null;
  }

  return data.signedUrl;
}

export async function resolveProfileAvatarUrl(input: {
  avatar_path: string | null;
  avatar_url: string | null;
}, options?: {
  useAdmin?: boolean;
}) {
  if (input.avatar_path) {
    const signedUrl = await createAvatarSignedUrl(input.avatar_path, options);
    if (signedUrl) {
      return signedUrl;
    }
  }

  return input.avatar_url;
}

export async function deleteAvatarObject(path: string | null) {
  if (!path || !hasServiceRoleEnv) {
    return;
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.storage.from(AVATAR_BUCKET).remove([path]);

  if (error) {
    throw error;
  }
}
