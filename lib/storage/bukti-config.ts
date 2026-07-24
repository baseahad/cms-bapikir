export const BUKTI_BUCKET = "bukti-transfer";
export const BUKTI_MAX_BYTES = 5 * 1024 * 1024;
export const BUKTI_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

const BUKTI_ALLOWED_TYPE_SET = new Set<string>(BUKTI_ALLOWED_TYPES);

export function isSupportedBuktiType(contentType: string) {
  return BUKTI_ALLOWED_TYPE_SET.has(contentType);
}

export function getBuktiObjectPath(userId: string, requestId: string) {
  return `${userId}/${requestId}`;
}
