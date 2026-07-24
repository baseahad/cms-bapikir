"use client";

import { useState, useMemo } from "react";
import { CheckIcon, MailIcon, TrashIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar";
import { ExportButton, downloadFile, toCsv } from "@/components/dashboard/export-button";
import { EmptyState } from "@/components/dashboard/empty-state";

export type WaitlistEntry = {
  id: string;
  email: string;
  name: string | null;
  wa: string | null;
  created_at: string;
};

// wa.me butuh format internasional tanpa "+": 0812... -> 62812...
function waLink(wa: string) {
  return `https://wa.me/${wa.replace(/^0/, "62")}`;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

const PAGE_SIZE = 10;

export function WaitlistTable({
  entries,
  onApprove,
  onRemove,
}: {
  entries: WaitlistEntry[];
  onApprove?: (entry: WaitlistEntry) => void;
  onRemove?: (entry: WaitlistEntry) => void;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.email.toLowerCase().includes(q) ||
        (e.name?.toLowerCase().includes(q) ?? false) ||
        (e.wa?.includes(q) ?? false)
    );
  }, [entries, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function handleExport(format: "csv" | "json") {
    if (format === "csv") {
      const csv = toCsv(filtered, [
        { key: "email", label: "Email" },
        { key: "name", label: "Nama" },
        { key: "wa", label: "WhatsApp" },
        { key: "created_at", label: "Tanggal Daftar" },
      ]);
      downloadFile(csv, "waitlist.csv", "text/csv");
    } else {
      downloadFile(
        JSON.stringify(filtered, null, 2),
        "waitlist.json",
        "application/json"
      );
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Waitlist</CardTitle>
          <span className="text-xs text-muted-foreground">
            {entries.length} pendaftar
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Cari email, nama, atau WA..."
        >
          <ExportButton onExport={handleExport} />
        </DataTableToolbar>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<MailIcon className="h-6 w-6" />}
            title="Belum ada pendaftar"
            description="Daftar waitlist akan muncul di sini."
          />
        ) : (
          <>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Nama
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      WhatsApp
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Tanggal
                    </TableHead>
                    {(onApprove || onRemove) && (
                      <TableHead className="w-24 text-right">Aksi</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium text-sm">
                        {entry.email}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {entry.name ?? "-"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {entry.wa ? (
                          <a
                            href={waLink(entry.wa)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline"
                          >
                            {entry.wa}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {formatDate(entry.created_at)}
                      </TableCell>
                      {(onApprove || onRemove) && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {onApprove && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:text-green-700"
                                onClick={() => onApprove(entry)}
                              >
                                <CheckIcon className="h-4 w-4" />
                              </Button>
                            )}
                            {onRemove && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => onRemove(entry)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {filtered.length} pendaftar
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
