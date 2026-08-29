import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from "vitest";

import {
  verifyLicenseKey,
  licenseRequired,
  evaluateLicense,
  _resetLicenseCache,
} from "@/lib/license/verify";
import {
  bytesToBase64Url,
  jsonToBase64Url,
  strToBytes,
} from "@/lib/license/base64url";
import type { LicenseClaims } from "@/lib/license/types";

let privKey: CryptoKey;
let pubB64: string;

async function makeKey(overrides: Partial<LicenseClaims> = {}): Promise<string> {
  const claims: LicenseClaims = {
    v: 1,
    id: "lic_test_1",
    sub: "Test <t@example.com>",
    tier: "studio",
    domains: ["example.com", "*.example.com"],
    projects: 3,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    updates_until: null,
    ...overrides,
  };
  const payload = "bpk1." + jsonToBase64Url(claims);
  const sig = new Uint8Array(
    await crypto.subtle.sign({ name: "Ed25519" }, privKey, strToBytes(payload)),
  );
  return payload + "." + bytesToBase64Url(sig);
}

beforeAll(async () => {
  const kp = (await crypto.subtle.generateKey({ name: "Ed25519" }, true, [
    "sign",
    "verify",
  ])) as CryptoKeyPair;
  privKey = kp.privateKey;
  pubB64 = bytesToBase64Url(
    new Uint8Array(await crypto.subtle.exportKey("raw", kp.publicKey)),
  );
});

beforeEach(() => {
  // Re-stub every test: afterEach's unstubAllEnvs also clears this one.
  vi.stubEnv("LICENSOR_PUBLIC_KEY_B64URL", pubB64);
});

afterEach(() => {
  _resetLicenseCache();
  vi.unstubAllEnvs();
});

describe("verifyLicenseKey", () => {
  it("accepts a good key on an allowed host", async () => {
    const s = await verifyLicenseKey(await makeKey(), "app.example.com");
    expect(s.status).toBe("valid");
    expect(s.entitled).toBe(true);
    expect(s.claims?.id).toBe("lic_test_1");
  });

  it("rejects a key on a host it does not license", async () => {
    const s = await verifyLicenseKey(await makeKey(), "evil.com");
    expect(s.status).toBe("invalid");
    expect(s.reason).toBe("host_not_licensed");
  });

  it("rejects a tampered signature", async () => {
    const k = await makeKey();
    const s = await verifyLicenseKey(k.slice(0, -6) + "AAAAAA", "app.example.com");
    expect(s.entitled).toBe(false);
    expect(s.reason).toBe("bad_signature");
  });

  it("rejects missing / malformed", async () => {
    expect((await verifyLicenseKey(undefined, "x")).reason).toBe(
      "missing_or_bad_prefix",
    );
    expect((await verifyLicenseKey("bpk1.only-two", "x")).reason).toBe("malformed");
  });

  it("gives a grace window just past expiry, then locks", async () => {
    const nearlyExpired = await makeKey({ exp: Math.floor(Date.now() / 1000) - 60 });
    expect((await verifyLicenseKey(nearlyExpired, "example.com")).status).toBe(
      "grace",
    );

    const longExpired = await makeKey({
      exp: Math.floor(Date.now() / 1000) - 60 * 24 * 60 * 60,
    });
    expect((await verifyLicenseKey(longExpired, "example.com")).status).toBe(
      "invalid",
    );
  });

  it("accepts a perpetual (exp: null) key", async () => {
    const s = await verifyLicenseKey(await makeKey({ exp: null }), "example.com");
    expect(s.status).toBe("valid");
  });
});

describe("licenseRequired", () => {
  it("is false off production", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(licenseRequired("app.example.com")).toBe(false);
  });
  it("is false for localhost / private ranges in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(licenseRequired("localhost")).toBe(false);
    expect(licenseRequired("192.168.1.20")).toBe(false);
  });
  it("is true for a public host in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(licenseRequired("app.example.com")).toBe(true);
  });
});

describe("evaluateLicense", () => {
  it("locks in production with no key", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const s = await evaluateLicense("app.example.com");
    expect(s.entitled).toBe(false);
  });
  it("passes in production with a good key", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("BAPIKIR_LICENSE_KEY", await makeKey());
    const s = await evaluateLicense("app.example.com");
    expect(s.entitled).toBe(true);
  });
  it("honours a revocation set", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("BAPIKIR_LICENSE_KEY", await makeKey());
    const s = await evaluateLicense("app.example.com", new Set(["lic_test_1"]));
    expect(s.status).toBe("revoked");
    expect(s.entitled).toBe(false);
  });
});
