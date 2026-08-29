// Path → gated-feature map. Used by the middleware guard (proxy.ts) so every
// gated route is covered from ONE place instead of editing dozens of handlers.
//
// Matching: a rule matches when the pathname equals `prefix` or starts with
// `prefix + "/"`. First match wins, so list more specific rules first.

import type { GatedFeature } from "./gate";

export interface PathRule {
  prefix: string;
  feature: GatedFeature;
  /** page → redirect to /admin/license; api → JSON 403. Default inferred from prefix. */
  kind?: "page" | "api";
}

/** Never gate these, even if a broader rule would catch them. */
export const ALWAYS_ALLOW: readonly string[] = [
  "/api/health",
  "/api/auth",
  "/auth",
  "/api/license", // (if a client-facing status route is ever added)
  "/admin/license", // the status page itself must render in limited mode
];

export const PATH_RULES: readonly PathRule[] = [
  // --- admin: dashboards + all admin APIs (incl. money-approval endpoints) ---
  { prefix: "/api/admin", feature: "admin", kind: "api" },
  { prefix: "/api/koin/admin", feature: "admin", kind: "api" },
  { prefix: "/api/payments/admin", feature: "admin", kind: "api" },
  { prefix: "/api/toko/admin", feature: "admin", kind: "api" },
  { prefix: "/admin", feature: "admin", kind: "page" },

  // --- AI authoring ---
  { prefix: "/api/ai", feature: "ai_scribe", kind: "api" },
  { prefix: "/api/scribe", feature: "ai_scribe", kind: "api" },
  { prefix: "/tulis", feature: "ai_scribe", kind: "page" },

  // --- money movement (buyer side): subscriptions, koin top-up/spend, toko orders ---
  { prefix: "/api/subscription", feature: "payments", kind: "api" },
  { prefix: "/api/payments", feature: "payments", kind: "api" },
  { prefix: "/api/koin/topup", feature: "payments", kind: "api" },
  { prefix: "/api/koin/beli", feature: "payments", kind: "api" },
  { prefix: "/api/koin/konfirmasi", feature: "payments", kind: "api" },
  { prefix: "/api/koin/bukti-upload-url", feature: "payments", kind: "api" },
  { prefix: "/api/toko/order", feature: "payments", kind: "api" },
  { prefix: "/api/toko/konfirmasi", feature: "payments", kind: "api" },
  { prefix: "/api/toko/bukti-upload-url", feature: "payments", kind: "api" },
  { prefix: "/checkout", feature: "payments", kind: "page" },
  { prefix: "/toko/pesan", feature: "payments", kind: "page" },
];

export interface PathMatch {
  feature: GatedFeature;
  kind: "page" | "api";
}

export function matchPath(pathname: string): PathMatch | null {
  const p = pathname.replace(/\/+$/, "") || "/";
  for (const allow of ALWAYS_ALLOW) {
    if (p === allow || p.startsWith(allow + "/")) return null;
  }
  for (const rule of PATH_RULES) {
    if (p === rule.prefix || p.startsWith(rule.prefix + "/")) {
      const kind = rule.kind ?? (rule.prefix.startsWith("/api") ? "api" : "page");
      return { feature: rule.feature, kind };
    }
  }
  return null;
}
