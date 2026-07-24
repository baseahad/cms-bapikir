export const AVATAR_BUCKET = "avatars";
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const AVATAR_ALLOWED_TYPE_SET = new Set<string>(AVATAR_ALLOWED_TYPES);

export function isSupportedAvatarType(contentType: string) {
  return AVATAR_ALLOWED_TYPE_SET.has(contentType);
}

export function getAvatarObjectPath(userId: string) {
  return `${userId}/avatar`;
}
