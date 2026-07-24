"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar";
import { ExportButton, downloadFile, toCsv } from "@/components/dashboard/export-button";
import { EyeIcon } from "lucide-react";

export type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  plan: string;
  role: "member" | "admin";
  status: string;
  created_at: string;
};

const planVariant: Record<string, "default" | "secondary" | "outline"> = {
  FREE: "outline",
  BASIC: "secondary",
  PRO: "default",
  ULTIMATE: "default",
};

const roleVariant: Record<"member" | "admin", "outline" | "default"> = {
  admin: "default",
  member: "outline",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

const PAGE_SIZE = 10;

export function UserTable({
  users,
  onViewUser,
}: {
  users: UserRow[];
  onViewUser?: (user: UserRow) => void;
}) {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = users;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          (u.full_name?.toLowerCase().includes(q) ?? false)
      );
    }
    if (planFilter !== "ALL") {
      result = result.filter((u) => u.plan === planFilter);
    }
    if (roleFilter !== "ALL") {
      result = result.filter((u) => u.role === roleFilter);
    }
    return result;
  }, [users, search, planFilter, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function handleExport(format: "csv" | "json") {
    if (format === "csv") {
      const csv = toCsv(filtered, [
        { key: "email", label: "Email" },
        { key: "full_name", label: "Nama" },
        { key: "plan", label: "Plan" },
        { key: "role", label: "Role" },
        { key: "status", label: "Status" },
        { key: "created_at", label: "Tanggal Daftar" },
      ]);
      downloadFile(csv, "users.csv", "text/csv");
    } else {
      downloadFile(
        JSON.stringify(filtered, null, 2),
        "users.json",
        "application/json"
      );
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Daftar Pengguna</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Cari email atau nama..."
          filters={[
            {
              value: planFilter,
              onChange: (v) => {
                setPlanFilter(v);
                setPage(1);
              },
              placeholder: "Semua Plan",
              options: [
                { label: "Semua Plan", value: "ALL" },
                { label: "Free", value: "FREE" },
                { label: "Basic", value: "BASIC" },
                { label: "Pro", value: "PRO" },
                { label: "Ultimate", value: "ULTIMATE" },
              ],
            },
            {
              value: roleFilter,
              onChange: (v) => {
                setRoleFilter(v);
                setPage(1);
              },
              placeholder: "Semua Role",
              options: [
                { label: "Semua Role", value: "ALL" },
                { label: "Admin", value: "admin" },
                { label: "Member", value: "member" },
              ],
            },
          ]}
        >
          <ExportButton onExport={handleExport} />
        </DataTableToolbar>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="hidden sm:table-cell">Nama</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden sm:table-cell">Tanggal Daftar</TableHead>
                {onViewUser && <TableHead className="w-10" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={onViewUser ? 6 : 5}
                    className="text-center text-muted-foreground py-8"
                  >
                    Tidak ada pengguna ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-sm">
                      {user.email}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {user.full_name ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={planVariant[user.plan] ?? "outline"}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[user.role] ?? "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
                    </TableCell>
                    {onViewUser && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onViewUser(user)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {filtered.length} pengguna total
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
