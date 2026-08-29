// Offline license-key verification for CMS Bapikir.
// Ed25519 signature check via Web Crypto (crypto.subtle) — portable across
// Node 20+, Cloudflare Workers, Deno. No Node 'crypto', no eval.
//
// Key string format:  bpk1.<base64url(claimsJSON)>.<base64url(signature)>
// Signature is over the ASCII bytes of  "bpk1.<base64url(claimsJSON)>".

import {
  base64UrlToBytes,
  base64UrlToJson,
  strToBytes,
} from "./base64url";
import type { LicenseClaims, LicenseState } from "./types";

/**
 * Licensor's Ed25519 PUBLIC key, raw 32 bytes, base64url. Safe to commit.
 *
 * Production key. sha256(pubkey)[:16] = "gwKGK6K6mKpxUhKF" (eyeball check).
 * Generated 2026-08-29 in the Licensor's own terminal via
 * scripts/keygen-safe.mjs; the private half exists only in a password manager.
 * To rotate later, make publicKeyB64Url() return an array and accept either key
 * during the transition.
 *
 * (Supersedes an earlier key "mCU26y-…" that was exposed in a chat transcript
 * and discarded before any license was issued.)
 */
const LICENSOR_PUBLIC_KEY_BAKED = "DLfZrRDSxmmBi1J2GFF09z7D6q5hYgh9qlWeYfbgNwk";

/**
 * Resolved at call time (not module load) so tests/staging can set
 * LICENSOR_PUBLIC_KEY_B64URL and so a key rotation takes effect on the next
 * cache reset without a full process restart. The env override is not a
 * meaningful security weakness — the source is BSL-readable, so this line can be
 * edited anyway. The signature check deters casual key-sharing and enables
 * revocation; it is not copy-protection.
 */
function publicKeyB64Url(): string {
  return process.env.LICENSOR_PUBLIC_KEY_B64URL || LICENSOR_PUBLIC_KEY_BAKED;
}

const KEY_PREFIX = "bpk1.";

/** Grace window (seconds) after `exp` before features lock. Protects payers from renewal-lag lockout. */
const EXPIRY_GRACE_SECONDS = 14 * 24 * 60 * 60; // 14 days

let cachedKey: { b64: string; key: CryptoKey } | null = null;
let cachedState: { at: number; sig: string; state: LicenseState } | null = null;
// Short TTL: cheap to re-verify, and we want a corrected key / lifted revocation
// to take effect fast without a process restart.
const STATE_TTL_MS = 30 * 1000;

function now(): number {
  return Math.floor(Date.now() / 1000);
}

async function getPublicKey(): Promise<CryptoKey> {
  const b64 = publicKeyB64Url();
  if (cachedKey && cachedKey.b64 === b64) return cachedKey.key;
  const key = await crypto.subtle.importKey(
    "raw",
    base64UrlToBytes(b64),
    { name: "Ed25519" },
    false,
    ["verify"],
  );
  cachedKey = { b64, key };
  return key;
}

function hostAllowed(host: string | null, domains: LicenseClaims["domains"]): boolean {
  if (domains === "*") return true;
  if (!host) return false;
  const h = host.toLowerCase().split(":")[0];
  return domains.some((d) => {
    const dd = d.toLowerCase();
    if (dd.startsWith("*.")) {
      const base = dd.slice(2);
      return h === base || h.endsWith("." + base);
    }
    return h === dd;
  });
}

function invalid(reason: string, host: string | null): LicenseState {
  return { status: "invalid", entitled: false, claims: null, reason, host };
}

/**
 * Verify a raw license key string against `host`. Pure — no env, no network.
 * Exported for tests and for the activation endpoint.
 */
export async function verifyLicenseKey(
  rawKey: string | undefined | null,
  host: string | null,
): Promise<LicenseState> {
  if (!rawKey || !rawKey.startsWith(KEY_PREFIX)) {
    return invalid("missing_or_bad_prefix", host);
  }
  const parts = rawKey.split(".");
  if (parts.length !== 3) return invalid("malformed", host);
  const [, payloadB64, sigB64] = parts;

  let ok = false;
  try {
    ok = await crypto.subtle.verify(
      { name: "Ed25519" },
      await getPublicKey(),
      base64UrlToBytes(sigB64),
      strToBytes(KEY_PREFIX + payloadB64),
    );
  } catch (e) {
    return invalid("verify_threw:" + (e as Error).name, host);
  }
  if (!ok) return invalid("bad_signature", host);

  let claims: LicenseClaims;
  try {
    claims = base64UrlToJson<LicenseClaims>(payloadB64);
  } catch {
    return invalid("claims_not_json", host);
  }
  if (claims.v !== 1 || !claims.id || !claims.tier) {
    return invalid("claims_shape", host);
  }

  if (!hostAllowed(host, claims.domains)) {
    return { status: "invalid", entitled: false, claims, reason: "host_not_licensed", host };
  }

  const t = now();
  if (claims.exp != null && t > claims.exp) {
    if (t <= claims.exp + EXPIRY_GRACE_SECONDS) {
      return {
        status: "grace",
        entitled: true,
        claims,
        reason: "expired_in_grace",
        graceEndsAt: claims.exp + EXPIRY_GRACE_SECONDS,
        host,
      };
    }
    return { status: "invalid", entitled: false, claims, reason: "expired_past_grace", host };
  }

  return { status: "valid", entitled: true, claims, reason: "ok", host };
}

/**
 * Is a license key required for this process at all?
 * BSL: production use that is publicly reachable needs a key; localhost / internal does not.
 */
export function licenseRequired(host: string | null): boolean {
  if (process.env.BAPIKIR_LICENSE_MODE === "eval") return false; // time-box this yourself if used
  const prod =
    process.env.BAPIKIR_ENV === "production" ||
    (process.env.NODE_ENV === "production" && process.env.BAPIKIR_ENV !== "development");
  if (!prod) return false;
  const h = (host ?? "").toLowerCase().split(":")[0];
  if (!h) return true;
  if (h === "localhost" || h === "127.0.0.1" || h === "::1" || h.endsWith(".local")) return false;
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h)) return false;
  return true;
}

/**
 * Full evaluation for the running app: reads BAPIKIR_LICENSE_KEY, applies
 * licenseRequired(), caches the result per-process.
 * `revokedIds` (optional) comes from the activation check / revocation list.
 */
export async function evaluateLicense(
  host: string | null,
  revokedIds?: ReadonlySet<string>,
): Promise<LicenseState> {
  // Cache key covers everything that changes the answer, so a swapped key,
  // env change, host change, or revocation-set change busts it immediately.
  const sig = [
    host ?? "",
    process.env.BAPIKIR_LICENSE_KEY ?? "",
    process.env.NODE_ENV ?? "",
    process.env.BAPIKIR_ENV ?? "",
    process.env.BAPIKIR_LICENSE_MODE ?? "",
    revokedIds && revokedIds.size ? [...revokedIds].sort().join(",") : "",
  ].join("|");

  if (
    cachedState &&
    cachedState.sig === sig &&
    Date.now() - cachedState.at < STATE_TTL_MS
  ) {
    return cachedState.state;
  }

  let state: LicenseState;
  if (!licenseRequired(host)) {
    state = {
      status: "valid",
      entitled: true,
      claims: null,
      reason: "license_not_required",
      host,
    };
  } else {
    state = await verifyLicenseKey(process.env.BAPIKIR_LICENSE_KEY, host);
    if (state.claims && revokedIds?.has(state.claims.id)) {
      state = {
        status: "revoked",
        entitled: false,
        claims: state.claims,
        reason: "revoked",
        host,
      };
    }
  }

  cachedState = { at: Date.now(), sig, state };
  return state;
}

/** Test/ops hook — drop caches (e.g. after key rotation in a long-lived worker). */
export function _resetLicenseCache(): void {
  cachedKey = null;
  cachedState = null;
}
