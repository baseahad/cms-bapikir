export const MEDIA_BUCKET = "media";
export const MEDIA_MAX_BYTES = 10 * 1024 * 1024; // 10MB
export const MEDIA_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
] as const;

const MEDIA_ALLOWED_TYPE_SET = new Set<string>(MEDIA_ALLOWED_TYPES);

export function isSupportedMediaType(contentType: string) {
  return MEDIA_ALLOWED_TYPE_SET.has(contentType);
}

export function getMediaStoragePath(userId: string, originalName: string) {
  const ext = originalName.split(".").pop() || "bin";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${userId}/${timestamp}-${random}.${ext}`;
}
