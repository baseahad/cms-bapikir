import { authFeatureEnabled } from "@/lib/config/public-features";
import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import { resolveProfileAvatarUrl } from "@/lib/storage/avatars";
import { createClient } from "@/lib/supabase/server";
import type { Row } from "@/types/database";

type ProfileSummary = Pick<
  Row<"profiles">,
  "avatar_path" | "avatar_url" | "created_at" | "full_name"
> & {
  avatar_image_url: string | null;
};

export async function getProfileForCurrentUser(userId: string): Promise<ProfileSummary | null> {
  if (!authFeatureEnabled) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, avatar_path, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    ...data,
    avatar_image_url: await resolveProfileAvatarUrl(data),
  };
}

export async function updateProfileForUser(
  userId: string,
  input: {
    avatar_path: string | null;
    avatar_url: string | null;
    full_name: string | null;
    sapaan?: string | null;
  },
) {
  if (!hasServiceRoleEnv) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  const adminClient = createAdminClient();
  return adminClient
    .from("profiles")
    .update({
      ...input,
      sapaan: input.sapaan ?? undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}
