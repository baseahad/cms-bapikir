"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACCESS_OPTIONS = [
  { value: "all", label: "Semua Akses" },
  { value: "free", label: "🟢 Gratis" },
  { value: "member", label: "🟡 Login" },
  { value: "premium", label: "🔒 Premium" },
  { value: "exclusive", label: "💎 Eksklusif" },
];

export function FilterBar({
  categories,
}: {
  categories: { slug: string; count: number }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") ?? "all";
  const currentAccess = searchParams.get("access") ?? "all";

  function updateParam(key: "category" | "access", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/blog${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <Select value={currentCategory} onValueChange={(v) => updateParam("category", v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.slug} value={c.slug} className="capitalize">
              {c.slug} ({c.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentAccess} onValueChange={(v) => updateParam("access", v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Akses" />
        </SelectTrigger>
        <SelectContent>
          {ACCESS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
