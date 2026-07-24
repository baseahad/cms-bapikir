import { Badge } from "@/components/ui/badge";

export type BlogAccess = "free" | "member" | "premium" | "exclusive";

const ACCESS_META: Record<BlogAccess, { emoji: string; label: string; className: string }> = {
  free: { emoji: "🟢", label: "Gratis", className: "border-green-500/30 text-green-600 dark:text-green-400" },
  member: { emoji: "🟡", label: "Login", className: "border-yellow-500/30 text-yellow-600 dark:text-yellow-400" },
  premium: { emoji: "🔒", label: "Premium", className: "border-orange-500/30 text-orange-600 dark:text-orange-400" },
  exclusive: { emoji: "💎", label: "Eksklusif", className: "border-blue-500/30 text-blue-600 dark:text-blue-400" },
};

export function resolveAccess(access: string | null): BlogAccess {
  return access === "member" || access === "premium" || access === "exclusive" ? access : "free";
}

export function AccessBadge({ access, className }: { access: string | null; className?: string }) {
  const meta = ACCESS_META[resolveAccess(access)];

  return (
    <Badge variant="outline" className={`${meta.className} ${className ?? ""}`}>
      {meta.emoji} {meta.label}
    </Badge>
  );
}
