import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { FeatureNotice } from "@/components/config/feature-notice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AdminUserManagement } from "@/components/admin/admin-user-management";
import { AuditLog } from "@/components/admin/audit-log";
import { WebhookEventsTable } from "@/components/admin/webhook-events-table";
import { AdminRevenueChart } from "@/components/dashboard/admin-revenue-chart";
import { getFeatureAvailability } from "@/lib/config/features";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { getRecentAuditLogs } from "@/lib/data/audit-logs";
import {
  getAdminMetrics,
  getAdminPaymentsPage,
  getAdminRevenueByDay,
  getAdminUsers,
} from "@/lib/data/admin";
import { isAdminUser } from "@/lib/data/user-roles";
import { getRecentWebhookEvents } from "@/lib/data/webhook-events";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin — CMS Bapikir",
  description: "Dashboard admin untuk memantau pendapatan dan subscription.",
  path: "/admin",
  noIndex: true,
});

const PAGE_SIZE = 10;

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PAID: "default",
  PENDING: "secondary",
  FAILED: "destructive",
  EXPIRED: "outline",
  REFUNDED: "secondary",
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

async function AdminContent({ page }: { page: number }) {
  const adminFeature = getFeatureAvailability("admin");
  if (!adminFeature.enabled) {
    return (
      <FeatureNotice
        description={adminFeature.message}
        missingEnv={adminFeature.missingEnv}
        title={adminFeature.title}
        toggleEnv={adminFeature.toggleEnv}
      />
    );
  }

  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

  if (!(await isAdminUser(user.id, user.email))) {
    redirect("/dashboard");
  }

  const [{ payments, total }, metrics, chartData, users, webhookEvents, auditLogs] =
    await Promise.all([
      getAdminPaymentsPage(page, PAGE_SIZE),
      getAdminMetrics(),
      getAdminRevenueByDay(),
      getAdminUsers(),
      getRecentWebhookEvents(),
      getRecentAuditLogs(),
    ]);

  const totalRevenue = metrics?.total_revenue ?? 0;
  const activeSubs = metrics?.active_subscriptions ?? 0;
  const paidSubs = metrics?.paid_subscriptions ?? 0;
  const freeSubs = metrics?.free_subscriptions ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Admin</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Revenue" value={formatRupiah(totalRevenue)} />
        <StatCard label="Active Subs" value={String(activeSubs)} />
        <StatCard label="Paid Plans" value={String(paidSubs)} />
        <StatCard label="Free Plans" value={String(freeSubs)} />
      </div>

      <AdminRevenueChart data={chartData} />

      <Separator />

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Manajemen Pengguna</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cari user, lihat detail billing, dan kelola role admin tanpa query manual.
          </p>
        </div>
        <AdminUserManagement currentAdminUserId={user.id} users={users} />
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Webhook Events</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pembayaran sekarang lewat transfer manual (verifikasi di{" "}
            <Link href="/admin/payments" className="underline underline-offset-2">
              /admin/payments
            </Link>
            ), jadi tabel ini akan kosong kecuali kamu sambungkan provider webhook baru.
          </p>
        </div>
        <WebhookEventsTable events={webhookEvents} />
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Audit Trail</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Lihat perubahan profil, aksi admin, dan event pembayaran terbaru tanpa inspect log manual.
          </p>
        </div>
        <AuditLog entries={auditLogs} />
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">Riwayat Pembayaran</h2>
        {payments.length === 0 ? (
          <p className="text-muted-foreground text-sm">Belum ada pembayaran.</p>
        ) : (
          <>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">
                        {p.external_id}
                      </TableCell>
                      <TableCell>{formatRupiah(p.amount)}</TableCell>
                      <TableCell className="capitalize text-sm">
                        {p.provider}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[p.status] ?? "secondary"}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {formatDate(p.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={page > 1 ? `/admin?page=${page - 1}` : "#"}
                        aria-disabled={page <= 1}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href={
                          page < totalPages ? `/admin?page=${page + 1}` : "#"
                        }
                        aria-disabled={page >= totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <AdminContentWrapper searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminContentWrapper({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  return <AdminContent page={page} />;
}
