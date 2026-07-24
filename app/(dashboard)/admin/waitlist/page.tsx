"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { WaitlistTable, type WaitlistEntry } from "@/components/admin/waitlist-table";

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/waitlist");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      toast.error("Gagal memuat waitlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  async function handleRemove(entry: WaitlistEntry) {
    if (!confirm(`Hapus pendaftaran "${entry.email}"?`)) return;

    try {
      const res = await fetch(`/api/admin/waitlist/${entry.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Entri dihapus");
      setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    } catch {
      toast.error("Gagal menghapus entri");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Waitlist</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Waitlist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Lead dari form waitlist publik dan sumber lain.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : (
        <WaitlistTable entries={entries} onRemove={handleRemove} />
      )}
    </div>
  );
}
