#!/usr/bin/env node
// Generate the Licensor's Ed25519 signing keypair WITHOUT ever printing the
// private key to stdout.
//
// Run this in YOUR OWN terminal (PowerShell / cmd / Git Bash) — NOT through
// Claude Code's `!` prefix and NOT via any assistant tool, so the private key
// never enters a conversation transcript.
//
//   cd <repo root>
//   node scripts/keygen-safe.mjs
//
// It writes:
//   PROD-PRIVATE-KEY.jwk.b64   <- move this into a password manager, then delete
//   PROD-PUBLIC-KEY.b64        <- paste this value to the assistant to bake in
// and prints ONLY the public key + a fingerprint.

import { writeFileSync } from "node:fs";

const kp = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
const rawPub = new Uint8Array(await crypto.subtle.exportKey("raw", kp.publicKey));
const jwkPriv = await crypto.subtle.exportKey("jwk", kp.privateKey);

const b64u = (u8) => Buffer.from(u8).toString("base64url");
const pub = b64u(rawPub);
const priv = Buffer.from(JSON.stringify(jwkPriv)).toString("base64url");
const fp = b64u(new Uint8Array(await crypto.subtle.digest("SHA-256", rawPub))).slice(0, 16);

writeFileSync("PROD-PRIVATE-KEY.jwk.b64", priv + "\n");
writeFileSync("PROD-PUBLIC-KEY.b64", pub + "\n");

console.log("");
console.log("PROD PUBLIC KEY  :", pub);
console.log("pubkey sha256[:16]:", fp);
console.log("");
console.log("private key -> PROD-PRIVATE-KEY.jwk.b64  (NOT printed here)");
console.log("Next: move that file's contents into a password manager, then delete the file.");
console.log("Paste ONLY the PROD PUBLIC KEY line above back to the assistant.");
