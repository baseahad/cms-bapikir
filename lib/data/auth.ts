import { cache } from "react";
import { authFeatureEnabled } from "@/lib/config/public-features";
import { createClient } from "@/lib/supabase/server";

export type AuthenticatedUser = {
  email: string;
  id: string;
};

export const getAuthenticatedUser = cache(
  async (): Promise<AuthenticatedUser | null> => {
    if (!authFeatureEnabled) {
      return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims?.sub || !data.claims.email) {
      return null;
    }

    return {
      email: String(data.claims.email),
      id: String(data.claims.sub),
    };
  },
);
