#!/usr/bin/env node
// CMS Bapikir license key tool (Licensor side).
//
//   node scripts/license-cli.mjs keygen
//   node scripts/license-cli.mjs issue --id lic_2026_0007 --tier studio \
//        --sub "Nama <email@x.com>" --domains a.com,*.b.com --months 12 --updates-months 12
//   node scripts/license-cli.mjs verify "<key>" --host a.com
//
// Private key is loaded from env LICENSOR_PRIVATE_KEY_JWK_B64 (base64url of the
// exported JWK) or --key-file <path>. NEVER commit the private key.

import { readFileSync } from "node:fs";

const subtle = globalThis.crypto.subtle;
const KEY_PREFIX = "bpk1.";

const b64url = {
  enc: (u8) => Buffer.from(u8).toString("base64url"),
  dec: (s) => new Uint8Array(Buffer.from(s, "base64url")),
  encJson: (v) => Buffer.from(JSON.stringify(v)).toString("base64url"),
  decJson: (s) => JSON.parse(Buffer.from(s, "base64url").toString("utf8")),
};
const te = new TextEncoder();

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) out[k] = true;
      else {
        out[k] = next;
        i++;
      }
    } else out._.push(a);
  }
  return out;
}

async function keygen() {
  const kp = await subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
  const rawPub = new Uint8Array(await subtle.exportKey("raw", kp.publicKey));
  const jwkPriv = await subtle.exportKey("jwk", kp.privateKey);
  console.log("\n# PUBLIC KEY — paste into lib/license/verify.ts LICENSOR_PUBLIC_KEY_B64URL");
  console.log(b64url.enc(rawPub));
  console.log("\n# PRIVATE KEY (JWK, base64url) — store in a password manager / secure env as");
  console.log("# LICENSOR_PRIVATE_KEY_JWK_B64=...   NEVER commit this.");
  console.log(Buffer.from(JSON.stringify(jwkPriv)).toString("base64url"));
  console.log("");
}

async function loadPrivateKey(args) {
  let jwkB64 = process.env.LICENSOR_PRIVATE_KEY_JWK_B64;
  if (args["key-file"]) jwkB64 = readFileSync(args["key-file"], "utf8").trim();
  if (!jwkB64) {
    console.error("error: set LICENSOR_PRIVATE_KEY_JWK_B64 or pass --key-file");
    process.exit(2);
  }
  const jwk = JSON.parse(Buffer.from(jwkB64, "base64url").toString("utf8"));
  return subtle.importKey("jwk", jwk, { name: "Ed25519" }, false, ["sign"]);
}

function monthsFromNow(n) {
  const d = new Date();
  d.setMonth(d.getMonth() + Number(n));
  return Math.floor(d.getTime() / 1000);
}

async function issue(args) {
  for (const req of ["id", "tier", "sub"]) {
    if (!args[req]) {
      console.error(`error: --${req} is required`);
      process.exit(2);
    }
  }
  const iat = Math.floor(Date.now() / 1000);
  const claims = {
    v: 1,
    id: String(args.id),
    sub: String(args.sub),
    tier: String(args.tier),
    domains:
      args.domains === "*" || !args.domains
        ? args.domains === "*"
          ? "*"
          : []
        : String(args.domains).split(",").map((s) => s.trim()).filter(Boolean),
    projects: args.projects ? Number(args.projects) : 1,
    iat,
    exp: args.perpetual ? null : monthsFromNow(args.months ?? 12),
    updates_until: args["updates-months"]
      ? monthsFromNow(args["updates-months"])
      : args.perpetual
      ? null
      : monthsFromNow(args.months ?? 12),
  };
  if (claims.domains !== "*" && claims.domains.length === 0) {
    console.error('error: --domains required (comma list, or "*" for unrestricted)');
    process.exit(2);
  }

  const payloadB64 = b64url.encJson(claims);
  const priv = await loadPrivateKey(args);
  const sig = new Uint8Array(
    await subtle.sign({ name: "Ed25519" }, priv, te.encode(KEY_PREFIX + payloadB64)),
  );
  const key = KEY_PREFIX + payloadB64 + "." + b64url.enc(sig);

  console.error("\nclaims:");
  console.error(JSON.stringify(claims, null, 2));
  console.error("\nlicense key:\n");
  console.log(key); // stdout = just the key, pipe-friendly
  console.error("");
}

async function verify(args) {
  const key = args._[1];
  if (!key) {
    console.error('error: usage: verify "<key>" --host a.com [--pubkey <b64url>]');
    process.exit(2);
  }
  const parts = key.split(".");
  if (parts.length !== 3 || parts[0] + "." !== KEY_PREFIX) {
    console.error("malformed key");
    process.exit(1);
  }
  const [, payloadB64, sigB64] = parts;
  const claims = b64url.decJson(payloadB64);
  const pub = args.pubkey || process.env.LICENSOR_PUBLIC_KEY_B64URL;
  if (!pub) {
    console.error("note: no --pubkey / LICENSOR_PUBLIC_KEY_B64URL — showing claims only, signature NOT checked\n");
    console.log(JSON.stringify(claims, null, 2));
    return;
  }
  const pubKey = await subtle.importKey("raw", b64url.dec(pub), { name: "Ed25519" }, false, ["verify"]);
  const ok = await subtle.verify(
    { name: "Ed25519" },
    pubKey,
    b64url.dec(sigB64),
    te.encode(KEY_PREFIX + payloadB64),
  );
  const host = args.host ? String(args.host).toLowerCase() : null;
  let hostOk = claims.domains === "*";
  if (!hostOk && host && Array.isArray(claims.domains)) {
    hostOk = claims.domains.some((d) =>
      d.startsWith("*.") ? host === d.slice(2) || host.endsWith("." + d.slice(2)) : host === d,
    );
  }
  const now = Math.floor(Date.now() / 1000);
  console.log(JSON.stringify(claims, null, 2));
  console.log("\nsignature :", ok ? "OK" : "BAD");
  console.log("host      :", host ?? "(none given)", hostOk ? "allowed" : "NOT allowed");
  console.log("expiry    :", claims.exp ? new Date(claims.exp * 1000).toISOString() : "perpetual",
    claims.exp && now > claims.exp ? "(EXPIRED)" : "");
  process.exit(ok && hostOk ? 0 : 1);
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];
if (cmd === "keygen") await keygen();
else if (cmd === "issue") await issue(args);
else if (cmd === "verify") await verify(args);
else {
  console.error("usage: license-cli.mjs <keygen|issue|verify> [options] — see file header");
  process.exit(2);
}
