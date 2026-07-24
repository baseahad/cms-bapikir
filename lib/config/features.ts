import {
  authFeatureEnabled,
  featureToggleEnv,
  getMissingEnv,
  getSupabaseConfigError,
  hasSupabasePublicEnv,
  publicFeatureFlags,
  supabasePublicEnvKeys,
} from "@/lib/config/public-features";

export type FeatureKey =
  | "admin"
  | "ai"
  | "auth"
  | "billing"
  | "contact"
  | "koin"
  | "payments"
  | "profileWrites"
  | "waitlist";

export type FeatureAvailability = {
  disabledByFlag: boolean;
  enabled: boolean;
  key: FeatureKey;
  message: string;
  missingEnv: string[];
  title: string;
  toggleEnv?: string;
};

type FeatureResultInput = {
  disabledByFlag?: boolean;
  enabled: boolean;
  key: FeatureKey;
  message: string;
  missingEnv?: string[];
  title: string;
  toggleEnv?: string;
};

export type AIProvider = "anthropic" | "google" | "openai";

const SERVICE_ROLE_ENV_KEYS = ["SUPABASE_SERVICE_ROLE_KEY"] as const;
const RESEND_ENV_KEYS = ["RESEND_API_KEY"] as const;

function createFeatureResult({
  disabledByFlag = false,
  enabled,
  key,
  message,
  missingEnv = [],
  title,
  toggleEnv,
}: FeatureResultInput) {
  return {
    disabledByFlag,
    enabled,
    key,
    message,
    missingEnv,
    title,
    toggleEnv,
  } satisfies FeatureAvailability;
}

function createSupabaseMissingFeature(
  key: FeatureKey,
  title: string,
  message: string,
  toggleEnv?: string,
) {
  return createFeatureResult({
    enabled: false,
    key,
    message,
    missingEnv: getMissingEnv(supabasePublicEnvKeys),
    title,
    toggleEnv,
  });
}

function getServiceRoleMissingEnv() {
  return getMissingEnv(SERVICE_ROLE_ENV_KEYS);
}

function resolveDisabledMessage(label: string, toggleEnv: string) {
  return `${label} dimatikan lewat ${toggleEnv}=false. Set kembali ke true kalau ingin mengaktifkannya lagi.`;
}

const AI_PROVIDER_ENV_KEYS: Record<AIProvider, string> = {
  anthropic: "ANTHROPIC_API_KEY",
  google: "GOOGLE_GENERATIVE_AI_API_KEY",
  openai: "OPENAI_API_KEY",
};

export function resolveAIProvider(
  value = process.env.AI_DEFAULT_PROVIDER,
): AIProvider {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "anthropic") return "anthropic";
  if (normalized === "google") return "google";
  return "openai";
}

export function getFeatureAvailability(feature: FeatureKey): FeatureAvailability {
  switch (feature) {
    case "auth": {
      if (!publicFeatureFlags.auth) {
        return createFeatureResult({
          disabledByFlag: true,
          enabled: false,
          key: "auth",
          message: resolveDisabledMessage("Auth", featureToggleEnv.auth),
          title: "Auth dinonaktifkan",
          toggleEnv: featureToggleEnv.auth,
        });
      }

      if (!authFeatureEnabled) {
        return createSupabaseMissingFeature(
          "auth",
          "Auth belum aktif",
          getSupabaseConfigError(),
          featureToggleEnv.auth,
        );
      }

      return createFeatureResult({
        enabled: true,
        key: "auth",
        message: "Auth aktif.",
        title: "Auth aktif",
        toggleEnv: featureToggleEnv.auth,
      });
    }
    case "waitlist": {
      if (!publicFeatureFlags.waitlist) {
        return createFeatureResult({
          disabledByFlag: true,
          enabled: false,
          key: "waitlist",
          message: resolveDisabledMessage("Waitlist", featureToggleEnv.waitlist),
          title: "Waitlist dinonaktifkan",
          toggleEnv: featureToggleEnv.waitlist,
        });
      }

      if (!hasSupabasePublicEnv) {
        return createSupabaseMissingFeature(
          "waitlist",
          "Waitlist belum aktif",
          [
            "Waitlist butuh Supabase public env dan tabel waitlist yang sudah dimigrasikan.",
            `Isi ${supabasePublicEnvKeys.join(", ")} atau set ${featureToggleEnv.waitlist}=false kalau page ini belum dipakai.`,
          ].join(" "),
          featureToggleEnv.waitlist,
        );
      }

      return createFeatureResult({
        enabled: true,
        key: "waitlist",
        message: "Waitlist aktif.",
        title: "Waitlist aktif",
        toggleEnv: featureToggleEnv.waitlist,
      });
    }
    case "contact": {
      if (!publicFeatureFlags.contact) {
        return createFeatureResult({
          disabledByFlag: true,
          enabled: false,
          key: "contact",
          message: resolveDisabledMessage("Form kontak", featureToggleEnv.contact),
          title: "Form kontak dinonaktifkan",
          toggleEnv: featureToggleEnv.contact,
        });
      }

      const missingEnv = getMissingEnv(RESEND_ENV_KEYS);
      if (missingEnv.length > 0) {
        return createFeatureResult({
          enabled: false,
          key: "contact",
          message: [
            "Form kontak belum aktif.",
            `Set ${missingEnv.join(", ")} untuk mengirim email dari halaman kontak.`,
            `Kalau app kamu belum butuh form kontak, set ${featureToggleEnv.contact}=false.`,
          ].join(" "),
          missingEnv,
          title: "Form kontak belum aktif",
          toggleEnv: featureToggleEnv.contact,
        });
      }

      return createFeatureResult({
        enabled: true,
        key: "contact",
        message: "Form kontak aktif.",
        title: "Form kontak aktif",
        toggleEnv: featureToggleEnv.contact,
      });
    }
    case "billing": {
      if (!publicFeatureFlags.payments) {
        return createFeatureResult({
          disabledByFlag: true,
          enabled: false,
          key: "billing",
          message: resolveDisabledMessage(
            "Billing",
            featureToggleEnv.payments,
          ),
          title: "Billing dinonaktifkan",
          toggleEnv: featureToggleEnv.payments,
        });
      }

      const missingEnv = [
        ...getMissingEnv(supabasePublicEnvKeys),
        ...getServiceRoleMissingEnv(),
      ];

      if (missingEnv.length > 0) {
        return createFeatureResult({
          enabled: false,
          key: "billing",
          message: [
            "Aksi billing butuh auth Supabase dan akses server write.",
            `Isi ${missingEnv.join(", ")} untuk mengaktifkan upgrade, cancel, dan resume subscription.`,
            `Kalau app kamu belum memakai billing, set ${featureToggleEnv.payments}=false.`,
          ].join(" "),
          missingEnv,
          title: "Billing belum aktif",
          toggleEnv: featureToggleEnv.payments,
        });
      }

      return createFeatureResult({
        enabled: true,
        key: "billing",
        message: "Billing aktif.",
        title: "Billing aktif",
        toggleEnv: featureToggleEnv.payments,
      });
    }
    case "koin": {
      if (!publicFeatureFlags.koin) {
        return createFeatureResult({
          disabledByFlag: true,
          enabled: false,
          key: "koin",
          message: resolveDisabledMessage("Koin Bapikir", featureToggleEnv.koin),
          title: "Koin dinonaktifkan",
          toggleEnv: featureToggleEnv.koin,
        });
      }

      const missingEnv = [
        ...getMissingEnv(supabasePublicEnvKeys),
        ...getServiceRoleMissingEnv(),
      ];

      if (missingEnv.length > 0) {
        return createFeatureResult({
          enabled: false,
          key: "koin",
          message: [
            "Top-up dan admin approve Koin Bapikir butuh Supabase auth dan service role.",
            `Isi ${missingEnv.join(", ")} untuk mengaktifkan alur top-up end-to-end.`,
            `Kalau app kamu belum butuh ekonomi koin, set ${featureToggleEnv.koin}=false.`,
          ].join(" "),
          missingEnv,
          title: "Koin belum aktif",
          toggleEnv: featureToggleEnv.koin,
        });
      }

      return createFeatureResult({
        enabled: true,
        key: "koin",
        message: "Koin Bapikir aktif.",
        title: "Koin aktif",
        toggleEnv: featureToggleEnv.koin,
      });
    }
    case "payments": {
      if (!publicFeatureFlags.payments) {
        return createFeatureResult({
          disabledByFlag: true,
          enabled: false,
          key: "payments",
          message: resolveDisabledMessage(
            "Pembayaran",
            featureToggleEnv.payments,
          ),
          title: "Pembayaran dinonaktifkan",
          toggleEnv: featureToggleEnv.payments,
        });
      }

      const missingEnv = [
        ...getMissingEnv(supabasePublicEnvKeys),
        ...getServiceRoleMissingEnv(),
      ];

      if (missingEnv.length > 0) {
        return createFeatureResult({
          enabled: false,
          key: "payments",
          message: [
            "Checkout transfer manual belum aktif.",
            `Isi ${missingEnv.join(", ")} untuk mengaktifkan alur pembayaran end-to-end.`,
            `Kalau app kamu belum butuh pembayaran, set ${featureToggleEnv.payments}=false.`,
          ].join(" "),
          missingEnv,
          title: "Pembayaran transfer manual belum aktif",
          toggleEnv: featureToggleEnv.payments,
        });
      }

      return createFeatureResult({
        enabled: true,
        key: "payments",
        message: "Transfer manual aktif.",
        title: "Pembayaran transfer manual aktif",
        toggleEnv: featureToggleEnv.payments,
      });
    }
    case "admin": {
      if (!publicFeatureFlags.admin) {
        return createFeatureResult({
          disabledByFlag: true,
          enabled: false,
          key: "admin",
          message: resolveDisabledMessage(
            "Dashboard admin",
            featureToggleEnv.admin,
          ),
          title: "Admin dinonaktifkan",
          toggleEnv: featureToggleEnv.admin,
        });
      }

      const missingEnv = [
        ...getMissingEnv(supabasePublicEnvKeys),
        ...getServiceRoleMissingEnv(),
      ];

      if (missingEnv.length > 0) {
        return createFeatureResult({
          enabled: false,
          key: "admin",
          message: [
            "Dashboard admin butuh auth Supabase dan SUPABASE_SERVICE_ROLE_KEY.",
            `Isi ${missingEnv.join(", ")} untuk mengaktifkan reporting, user management, dan audit log.`,
            `Kalau app kamu belum butuh admin panel, set ${featureToggleEnv.admin}=false.`,
          ].join(" "),
          missingEnv,
          title: "Admin belum aktif",
          toggleEnv: featureToggleEnv.admin,
        });
      }

      return createFeatureResult({
        enabled: true,
        key: "admin",
        message: "Admin aktif.",
        title: "Admin aktif",
        toggleEnv: featureToggleEnv.admin,
      });
    }
    case "profileWrites": {
      const missingEnv = getServiceRoleMissingEnv();

      if (missingEnv.length > 0) {
        return createFeatureResult({
          enabled: false,
          key: "profileWrites",
          message: [
            "Edit profil server-side belum aktif.",
            `Isi ${missingEnv.join(", ")} untuk mengaktifkan simpan profil, role bootstrap, dan write lain yang memakai service role.`,
          ].join(" "),
          missingEnv,
          title: "Edit profil belum aktif",
        });
      }

      return createFeatureResult({
        enabled: true,
        key: "profileWrites",
        message: "Edit profil aktif.",
        title: "Edit profil aktif",
      });
    }
    case "ai": {
      if (!publicFeatureFlags.ai) {
        return createFeatureResult({
          disabledByFlag: true,
          enabled: false,
          key: "ai",
          message: resolveDisabledMessage("AI", featureToggleEnv.ai),
          title: "AI dinonaktifkan",
          toggleEnv: featureToggleEnv.ai,
        });
      }

      const provider = resolveAIProvider();
      const missingEnv = [
        ...getMissingEnv(supabasePublicEnvKeys),
        ...getMissingEnv([AI_PROVIDER_ENV_KEYS[provider]]),
      ];

      if (missingEnv.length > 0) {
        return createFeatureResult({
          enabled: false,
          key: "ai",
          message: [
            `Fitur AI (${provider}) belum aktif.`,
            `Isi ${missingEnv.join(", ")} untuk membuka route AI dan usage tracking.`,
            `Kalau AI belum dipakai, set ${featureToggleEnv.ai}=false.`,
          ].join(" "),
          missingEnv,
          title: "AI belum aktif",
          toggleEnv: featureToggleEnv.ai,
        });
      }

      return createFeatureResult({
        enabled: true,
        key: "ai",
        message: `AI (${provider}) aktif.`,
        title: "AI aktif",
        toggleEnv: featureToggleEnv.ai,
      });
    }
  }
}

export function getFeatureAvailabilityMap(
  keys: readonly FeatureKey[] = [
    "auth",
    "waitlist",
    "contact",
    "billing",
    "payments",
    "admin",
    "ai",
  ],
) {
  return Object.fromEntries(
    keys.map((key) => [key, getFeatureAvailability(key)]),
  ) as Record<(typeof keys)[number], FeatureAvailability>;
}
