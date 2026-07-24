const DISABLED_FLAG_VALUES = new Set(["0", "false", "no", "off"]);

function isPresent(value: string | undefined) {
  return Boolean(value?.trim());
}

function isFeatureFlagEnabled(value: string | undefined) {
  if (!value) {
    return true;
  }

  return !DISABLED_FLAG_VALUES.has(value.trim().toLowerCase());
}

export const featureToggleEnv = {
  admin: "NEXT_PUBLIC_ENABLE_ADMIN",
  ai: "NEXT_PUBLIC_ENABLE_AI",
  auth: "NEXT_PUBLIC_ENABLE_AUTH",
  contact: "NEXT_PUBLIC_ENABLE_CONTACT",
  koin: "NEXT_PUBLIC_ENABLE_KOIN",
  payments: "NEXT_PUBLIC_ENABLE_PAYMENTS",
  waitlist: "NEXT_PUBLIC_ENABLE_WAITLIST",
} as const;

export const publicFeatureFlags = {
  admin: isFeatureFlagEnabled(process.env.NEXT_PUBLIC_ENABLE_ADMIN),
  ai: isFeatureFlagEnabled(process.env.NEXT_PUBLIC_ENABLE_AI),
  auth: isFeatureFlagEnabled(process.env.NEXT_PUBLIC_ENABLE_AUTH),
  contact: isFeatureFlagEnabled(process.env.NEXT_PUBLIC_ENABLE_CONTACT),
  koin: isFeatureFlagEnabled(process.env.NEXT_PUBLIC_ENABLE_KOIN),
  payments: isFeatureFlagEnabled(process.env.NEXT_PUBLIC_ENABLE_PAYMENTS),
  waitlist: isFeatureFlagEnabled(process.env.NEXT_PUBLIC_ENABLE_WAITLIST),
} as const;

export const supabasePublicEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

export function getMissingEnv(keys: readonly string[]) {
  return keys.filter((key) => !isPresent(process.env[key]));
}

export const hasSupabasePublicEnv =
  getMissingEnv(supabasePublicEnvKeys).length === 0;

export const authFeatureEnabled =
  publicFeatureFlags.auth && hasSupabasePublicEnv;

export const waitlistFeatureEnabled =
  publicFeatureFlags.waitlist && hasSupabasePublicEnv;

export function getSupabaseConfigError() {
  return [
    "Supabase auth belum aktif.",
    `Isi ${supabasePublicEnvKeys.join(", ")} untuk mengaktifkan login, signup, dan dashboard.`,
    `Kalau app kamu belum butuh auth, set ${featureToggleEnv.auth}=false.`,
  ].join(" ");
}
