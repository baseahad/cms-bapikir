"use client";

import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  CreditCardIcon,
  LogInIcon,
  ShieldIcon,
  UserCircleIcon,
  UserPlusIcon,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar";
import type { AuditEntry, AuditEventType } from "@/lib/data/audit-logs";
import { cn } from "@/lib/utils";

export type { AuditEntry, AuditEventType };

const eventIcons: Record<AuditEventType, LucideIcon> = {
  "admin.action": ShieldIcon,
  "payment.failed": CreditCardIcon,
  "payment.success": CreditCardIcon,
  "profile.update": UserCircleIcon,
  "subscription.change": ShieldIcon,
  "user.signup": UserPlusIcon,
  "user.login": LogInIcon,
};

const eventColors: Record<AuditEventType, string> = {
  "admin.action": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "payment.failed": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "payment.success": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "profile.update": "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  "subscription.change": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "user.signup": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "user.login": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const typeLabels: Record<AuditEventType, string> = {
  "admin.action": "Admin",
  "payment.failed": "Payment Failed",
  "payment.success": "Payment",
  "profile.update": "Profile",
  "subscription.change": "Subscription",
  "user.signup": "Signup",
  "user.login": "Login",
};

const PAGE_SIZE = 15;

export function AuditLog({ entries }: { entries: AuditEntry[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.actor_email.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Audit Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Cari event atau email..."
        />

        {paginated.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Tidak ada event ditemukan.
          </p>
        ) : (
          <div className="space-y-3">
            {paginated.map((entry) => {
              const Icon = eventIcons[entry.type];
              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div
                    className={cn(
                      "rounded-full p-1.5 shrink-0 mt-0.5",
                      eventColors[entry.type]
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">
                        {entry.description}
                      </p>
                      <Badge variant="outline" className="text-[10px]">
                        {typeLabels[entry.type]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {entry.actor_email}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {filtered.length} event total
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Sebelumnya
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
