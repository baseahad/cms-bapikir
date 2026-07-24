import { FeatureNotice } from "@/components/config/feature-notice";
import {
  featureToggleEnv,
  supabasePublicEnvKeys,
} from "@/lib/config/public-features";

type SupabaseEnvNoticeProps = {
  compact?: boolean;
};

export function SupabaseEnvNotice({
  compact = false,
}: SupabaseEnvNoticeProps) {
  if (compact) {
    return (
      <p className="text-sm text-muted-foreground">
        Auth belum aktif. Isi env Supabase atau set{" "}
        <code>{featureToggleEnv.auth}=false</code>.
      </p>
    );
  }

  return (
    <FeatureNotice
      description="Boilerplate tetap bisa dipakai tanpa auth. Saat kamu siap menyalakannya, isi env Supabase publik untuk login, signup, session, dan dashboard."
      missingEnv={[...supabasePublicEnvKeys]}
      title="Auth belum aktif"
      toggleEnv={featureToggleEnv.auth}
    />
  );
}
