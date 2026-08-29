// Optional online activation / revocation check (client side = the licensed app).
//
// Offline signature verification (verify.ts) is the real gate. This adds:
//   - revocation (refunds, abuse) without shipping a new build
//   - soft enforcement of the per-license instance/project count
//   - a heartbeat the Licensor can see
//
// Rules:
//   - MUST fail open: a network blip or a downed Licensor endpoint never locks
//     out a paying customer.
//   - MUST NOT block the request hot path: getRevokedIds() returns the cached
//     answer immediately and refreshes in the background when stale. Revocation
//     therefore takes effect on a later request, which is fine (72h revoke grace
//     on top).

import type { LicenseClaims } from "./types";

const ACTIVATION_URL =
  process.env.BAPIKIR_ACTIVATION_URL ?? "https://avathur.id/api/license/activate";

const DISABLED = ["1", "true", "yes", "on"].includes(
  (process.env.BAPIKIR_ACTIVATION_DISABLED ?? "").toLowerCase(),
);

/** How long a cached activation answer stays trusted before a background refresh. */
const REFRESH_AFTER_MS = 24 * 60 * 60 * 1000; // 1 day
/** Grace after a fresh "revoked" before features actually lock. */
export const REVOKE_GRACE_SECONDS = 72 * 60 * 60; // 3 days

export interface ActivationResult {
  ok: boolean;
  revoked: boolean;
  /** Server clock (unix seconds) when this answer was produced. */
  at: number;
  /** Set when revoked: when the grace ends. */
  revokeEffectiveAt?: number;
  note?: string;
}

export interface ActivationStore {
  get(id: string): ActivationResult | null | Promise<ActivationResult | null>;
  set(id: string, v: ActivationResult): void | Promise<void>;
}

/** Stable-ish id for this deployment (so the Licensor can count instances). */
export function instanceId(): string {
  return (
    process.env.BAPIKIR_INSTANCE_ID ??
    process.env.RAILWAY_DEPLOYMENT_ID ??
    process.env.CF_PAGES_COMMIT_SHA ??
    process.env.HOSTNAME ??
    "unknown"
  );
}

const inflight = new Set<string>();

/**
 * Returns the set of revoked license ids to feed into evaluateLicense().
 * Never throws, never blocks on the network. Uses cached data; refreshes it in
 * the background when stale.
 */
export async function getRevokedIds(
  claims: LicenseClaims | null,
  host: string | null,
  store: ActivationStore,
): Promise<ReadonlySet<string>> {
  if (!claims || DISABLED) return EMPTY;

  const cached = (await Promise.resolve(store.get(claims.id)).catch(() => null)) ?? null;
  const stale = !cached || Date.now() - cached.at * 1000 >= REFRESH_AFTER_MS;

  if (stale && !inflight.has(claims.id)) {
    inflight.add(claims.id);
    void refresh(claims, host, store).finally(() => inflight.delete(claims.id));
  }

  if (cached?.revoked) {
    const effective = cached.revokeEffectiveAt ?? cached.at + REVOKE_GRACE_SECONDS;
    if (Math.floor(Date.now() / 1000) >= effective) return new Set([claims.id]);
  }
  return EMPTY;
}

const EMPTY: ReadonlySet<string> = new Set();

async function refresh(
  claims: LicenseClaims,
  host: string | null,
  store: ActivationStore,
): Promise<void> {
  try {
    const res = await fetch(ACTIVATION_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        license_id: claims.id,
        tier: claims.tier,
        domain: (host ?? "").split(":")[0],
        instance_id: instanceId(),
        v: 1,
      }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return; // keep last good cache
    const body = (await res.json()) as Partial<ActivationResult>;
    await Promise.resolve(
      store.set(claims.id, {
        ok: body.ok !== false,
        revoked: body.revoked === true,
        at: body.at ?? Math.floor(Date.now() / 1000),
        revokeEffectiveAt: body.revokeEffectiveAt,
        note: body.note,
      }),
    );
  } catch {
    // network/timeout — leave the cache as-is (fail open)
  }
}

/**
 * Default store: module-level Map. Fine for a single long-lived Node process
 * (VPS). For Cloudflare Workers use a KV-backed store; for multi-instance use a
 * shared Supabase row. Cache loss just means a re-fetch — never a lockout.
 */
export function memoryStore(): ActivationStore {
  const m = new Map<string, ActivationResult>();
  return {
    get: (id) => m.get(id) ?? null,
    set: (id, v) => void m.set(id, v),
  };
}

/** Shared singleton so every request in a process reuses one cache. */
export const defaultActivationStore: ActivationStore = memoryStore();
