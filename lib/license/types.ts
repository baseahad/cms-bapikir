// License claim + verification result types for CMS Bapikir.

export type LicenseTier = "personal" | "studio" | "agency";

/**
 * Claims embedded in a license key. Kept small and stable — everything the app
 * needs to decide access is here, so verification is fully offline.
 */
export interface LicenseClaims {
  /** Claim schema version. */
  v: 1;
  /** Opaque license id (also the revocation key). e.g. "lic_2026_0007". */
  id: string;
  /** Human-readable buyer identity, for display in /admin. e.g. "Nama <email>". */
  sub: string;
  tier: LicenseTier;
  /**
   * Domains this key authorises for production use. Exact host or one leading
   * "*." wildcard (e.g. "*.example.com"). "*" means any domain (agency/OEM).
   */
  domains: string[] | "*";
  /** Max concurrent production instances/projects. Informational + activation-enforced. */
  projects: number;
  /** Issued-at (unix seconds). */
  iat: number;
  /** Hard expiry (unix seconds). null = perpetual license. */
  exp: number | null;
  /** Free updates cutoff (unix seconds). Builds published after this need renewal. */
  updates_until: number | null;
}

export type LicenseStatus =
  | "valid" //   signed, in date, host allowed
  | "grace" //   expired/renewal-lapsed but inside the grace window — still full function
  | "invalid" // missing, malformed, bad signature, wrong host, past grace
  | "revoked"; //  activation endpoint (or revocation list) says this id is revoked

export interface LicenseState {
  status: LicenseStatus;
  /** True when the app should run every feature (valid OR grace). */
  entitled: boolean;
  claims: LicenseClaims | null;
  /** Short machine reason, safe to log. */
  reason: string;
  /** For "grace": unix seconds when grace ends and features lock. */
  graceEndsAt?: number;
  /** Evaluated against this host. */
  host: string | null;
}
