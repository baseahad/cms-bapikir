const disabledValues = new Set(["0", "false", "no", "off"]);

function isMissing(key) {
  const value = process.env[key];
  return !value || value.trim().length === 0;
}

function isFeatureEnabled(key) {
  const value = process.env[key];
  if (!value) {
    return true;
  }

  return !disabledValues.has(value.trim().toLowerCase());
}

function resolveAIProvider() {
  const value = process.env.AI_DEFAULT_PROVIDER?.trim().toLowerCase();
  if (value === "anthropic") return "anthropic";
  if (value === "google") return "google";
  return "openai";
}

const AI_PROVIDER_ENV_KEYS = {
  anthropic: "ANTHROPIC_API_KEY",
  google: "GOOGLE_GENERATIVE_AI_API_KEY",
  openai: "OPENAI_API_KEY",
};

function getMissing(keys) {
  return keys.filter(isMissing);
}

const supabasePublicKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];

const aiProvider = resolveAIProvider();

const featureChecks = [
  {
    name: "auth",
    description: "Login, signup, dashboard, dan auth callback",
    requiredEnv: supabasePublicKeys,
    toggle: "NEXT_PUBLIC_ENABLE_AUTH",
  },
  {
    name: "waitlist",
    description: "Form waitlist publik",
    requiredEnv: supabasePublicKeys,
    toggle: "NEXT_PUBLIC_ENABLE_WAITLIST",
  },
  {
    name: "contact",
    description: "Pengiriman form kontak via Resend",
    requiredEnv: ["RESEND_API_KEY", "CONTACT_EMAIL"],
    toggle: "NEXT_PUBLIC_ENABLE_CONTACT",
  },
  {
    name: "billing",
    description: "Upgrade, cancel, dan resume subscription",
    requiredEnv: [...supabasePublicKeys, "SUPABASE_SERVICE_ROLE_KEY"],
    toggle: "NEXT_PUBLIC_ENABLE_PAYMENTS",
  },
  {
    name: "payments",
    description: "Checkout transfer manual (MALIYA CENTER) end-to-end",
    requiredEnv: [...supabasePublicKeys, "SUPABASE_SERVICE_ROLE_KEY"],
    toggle: "NEXT_PUBLIC_ENABLE_PAYMENTS",
  },
  {
    name: "admin",
    description: "Dashboard admin, reporting, dan role management",
    requiredEnv: [...supabasePublicKeys, "SUPABASE_SERVICE_ROLE_KEY"],
    toggle: "NEXT_PUBLIC_ENABLE_ADMIN",
  },
  {
    name: "koin",
    description: "Top-up Koin Bapikir + admin approve (MALIYA CENTER)",
    requiredEnv: [...supabasePublicKeys, "SUPABASE_SERVICE_ROLE_KEY"],
    toggle: "NEXT_PUBLIC_ENABLE_KOIN",
  },
  {
    name: "ai",
    description: `Route AI (${aiProvider}) dan usage tracking`,
    requiredEnv: [...supabasePublicKeys, AI_PROVIDER_ENV_KEYS[aiProvider]],
    toggle: "NEXT_PUBLIC_ENABLE_AI",
  },
];

const activeMissing = [];

console.log("Feature readiness:");

for (const feature of featureChecks) {
  const enabled = isFeatureEnabled(feature.toggle);
  const missing = enabled ? getMissing(feature.requiredEnv) : [];

  if (!enabled) {
    console.log(`- ${feature.name}: disabled by ${feature.toggle}=false`);
    continue;
  }

  if (missing.length === 0) {
    console.log(`- ${feature.name}: ready`);
    continue;
  }

  activeMissing.push({ ...feature, missing });
  console.log(`- ${feature.name}: fallback mode`);
  console.log(`  missing: ${missing.join(", ")}`);
}

console.log("\nOther optional env:");
for (const key of ["NEXT_PUBLIC_APP_URL", "EMAIL_FROM", "ADMIN_EMAILS"]) {
  if (isMissing(key)) {
    console.log(`- ${key}`);
  }
}

if (activeMissing.length === 0) {
  console.log("\nAll enabled features have the env they need.");
} else {
  console.log("\nEnabled features still missing config will stay in fallback mode until configured.");
}

// --- License (BSL) readiness -------------------------------------------------
// Soft check only: presence + whether a key is even required here. Signature
// validity is checked at runtime by lib/license/verify.ts, not here.
{
  const explicitEnv = process.env.BAPIKIR_ENV?.trim().toLowerCase();
  const isProd =
    explicitEnv === "production" ||
    (process.env.NODE_ENV === "production" && explicitEnv !== "development");
  const evalMode = process.env.BAPIKIR_LICENSE_MODE?.trim().toLowerCase() === "eval";

  let host = "";
  try {
    host = new URL(process.env.NEXT_PUBLIC_APP_URL ?? "").hostname.toLowerCase();
  } catch {
    host = "";
  }
  const privateHost =
    !host ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local") ||
    /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);

  const required = isProd && !privateHost && !evalMode;
  const hasKey = !isMissing("BAPIKIR_LICENSE_KEY");

  console.log("\nLicense (BSL):");
  if (!required) {
    const why = evalMode
      ? "BAPIKIR_LICENSE_MODE=eval"
      : !isProd
        ? "not production"
        : `non-public host (${host || "unset NEXT_PUBLIC_APP_URL"})`;
    console.log(`- not required here (${why})${hasKey ? " — key is set anyway" : ""}`);
  } else if (hasKey) {
    console.log("- BAPIKIR_LICENSE_KEY is set (runtime verifies the signature)");
  } else {
    console.log("- WARNING: BAPIKIR_LICENSE_KEY is missing.");
    console.log("  This is a public production host, so the app will run in LIMITED MODE:");
    console.log("  admin, checkout, payments, and AI are locked until a valid key is set.");
    console.log("  Get one at lisensi@avathur.id, then set BAPIKIR_LICENSE_KEY and restart.");
  }
}
