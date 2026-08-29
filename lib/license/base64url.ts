// Runtime-portable base64url helpers.
// Works on Node 20+, Cloudflare Workers, Deno, browsers — no Buffer, no eval.
//
// Return type is pinned to `Uint8Array<ArrayBuffer>` (not the wider
// `ArrayBufferLike`) so the results pass straight into Web Crypto's
// `BufferSource` parameters under strict TS 5.7+ lib types.

export function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64UrlToBytes(b64url: string): Uint8Array<ArrayBuffer> {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    Math.ceil(b64url.length / 4) * 4,
    "=",
  );
  const bin = atob(b64);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const enc = new TextEncoder();
const dec = new TextDecoder();

export function strToBytes(s: string): Uint8Array<ArrayBuffer> {
  const u = enc.encode(s);
  const out = new Uint8Array(new ArrayBuffer(u.byteLength));
  out.set(u);
  return out;
}

export function bytesToStr(b: Uint8Array): string {
  return dec.decode(b);
}

export function jsonToBase64Url(value: unknown): string {
  return bytesToBase64Url(strToBytes(JSON.stringify(value)));
}

export function base64UrlToJson<T = unknown>(b64url: string): T {
  return JSON.parse(bytesToStr(base64UrlToBytes(b64url))) as T;
}
