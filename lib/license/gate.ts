// What "limited mode" locks, and helpers the app calls at each gate.
//
// Principle: never lock read-only public surfaces (marketing, blog, a logged-in
// end-user viewing their own dashboard) — that just looks broken and pushes
// people away. Lock the value surfaces: admin, money movement, AI authoring.

import { evaluateLicense } from "./verify";
import { matchPath } from "./paths";
import { defaultActivationStore, getRevokedIds } from "./activation";
import type { LicenseState } from "./types";

/** Feature areas gated behind a valid license in production. */
export type GatedFeature =
  | "admin" //     /admin/* + all admin APIs (incl. payment/koin approval)
  | "payments" //  creating orders, subscription checkout, koin top-up/spend, transfer confirm
  | "ai_scribe"; //  /tulis and /api/ai/*, /api/scribe

export const GATED_FEATURES: readonly GatedFeature[] = ["admin", "payments", "ai_scribe"];

/** Public host from a Request/Headers, best-effort. */
export function hostFromHeaders(h: Headers): string | null {
  return h.get("x-forwarded-host") ?? h.get("host") ?? null;
}

export async function getLicenseState(host: string | null): Promise<LicenseState> {
  const first = await evaluateLicense(host);
  // No key / not required → nothing to revoke.
  if (!first.claims) return first;
  // Non-blocking: returns cached revocations, refreshes in the background.
  const revoked = await getRevokedIds(first.claims, host, defaultActivationStore);
  if (revoked.size === 0) return first;
  return evaluateLicense(host, revoked);
}

export async function isFeatureLocked(
  feature: GatedFeature,
  host: string | null,
): Promise<boolean> {
  if (!GATED_FEATURES.includes(feature)) return false;
  const state = await getLicenseState(host);
  return !state.entitled;
}

export type GateDecision =
  | { action: "allow" }
  | { action: "redirect"; to: string; feature: GatedFeature }
  | { action: "block"; feature: GatedFeature; status: LicenseState["status"]; body: string };

/**
 * Framework-agnostic middleware guard. Call from proxy.ts with the incoming
 * request; translate the decision to a NextResponse there. Covers every gated
 * route via lib/license/paths.ts — no per-handler wiring.
 */
export async function evaluateGate(req: Request): Promise<GateDecision> {
  const url = new URL(req.url);
  const match = matchPath(url.pathname);
  if (!match) return { action: "allow" };

  const host = hostFromHeaders(req.headers);
  if (!(await isFeatureLocked(match.feature, host))) return { action: "allow" };

  if (match.kind === "page") {
    return {
      action: "redirect",
      feature: match.feature,
      to: `/admin/license?from=${encodeURIComponent(url.pathname)}`,
    };
  }
  const state = await getLicenseState(host);
  return {
    action: "block",
    feature: match.feature,
    status: state.status,
    body: JSON.stringify({
      error: "license_required",
      feature: match.feature,
      status: state.status,
      message:
        "CMS Bapikir berjalan dalam mode terbatas. Fitur ini butuh license key yang valid. Lihat /admin/license atau hubungi lisensi@avathur.id.",
    }),
  };
}

/** Web-standard wrapper for non-Next callers (returns null to allow). */
export async function licenseGate(req: Request): Promise<Response | null> {
  const d = await evaluateGate(req);
  if (d.action === "allow") return null;
  if (d.action === "redirect") {
    return new Response(null, { status: 307, headers: { location: d.to } });
  }
  return new Response(d.body, {
    status: 403,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

/**
 * Direct guard for an individual route handler / server action — defense in
 * depth for the money routes if middleware is ever bypassed. Returns null when
 * allowed.
 */
export async function guardFeature(
  feature: GatedFeature,
  req: Request,
): Promise<Response | null> {
  if (!(await isFeatureLocked(feature, hostFromHeaders(req.headers)))) return null;
  return jsonLocked(feature, await getLicenseState(hostFromHeaders(req.headers)));
}

function jsonLocked(feature: GatedFeature, state: LicenseState): Response {
  return new Response(
    JSON.stringify({
      error: "license_required",
      feature,
      status: state.status,
      message:
        "CMS Bapikir berjalan dalam mode terbatas. Fitur ini butuh license key yang valid. Lihat /admin/license atau hubungi lisensi@avathur.id.",
    }),
    { status: 403, headers: { "content-type": "application/json", "cache-control": "no-store" } },
  );
}

/** For the layout banner. Returns null when fully licensed. */
export async function limitedModeBanner(
  host: string | null,
): Promise<{ show: boolean; tone: "warn" | "info"; text: string } | null> {
  const state = await getLicenseState(host);
  if (state.status === "valid") return null;
  if (state.status === "grace") {
    return {
      show: true,
      tone: "info",
      text: "Lisensi CMS Bapikir sudah lewat masa berlaku — masih aktif penuh selama masa tenggang. Segera perpanjang di lisensi@avathur.id.",
    };
  }
  return {
    show: true,
    tone: "warn",
    text: "CMS Bapikir berjalan dalam MODE TERBATAS (belum berlisensi untuk produksi). Admin, checkout, pembayaran, dan AI dikunci. Aktifkan di lisensi@avathur.id.",
  };
}
