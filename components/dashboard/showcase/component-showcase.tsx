"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  InboxIcon,
  PackageIcon,
} from "lucide-react";

import { StatsGrid } from "@/components/dashboard/stats-grid";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PaymentStatusBadge } from "@/components/dashboard/payment-status-badge";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar";
import { ExportButton } from "@/components/dashboard/export-button";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { UsageMeter } from "@/components/dashboard/usage-meter";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PlanComparisonModal } from "@/components/dashboard/plan-comparison-modal";
import { ProfileAvatar } from "@/components/dashboard/profile-avatar";
import {
  NotificationDropdown,
  type Notification,
} from "@/components/dashboard/notification-dropdown";
import { CommandPalette } from "@/components/dashboard/command-palette";
import {
  OnboardingChecklist,
  type OnboardingStep,
} from "@/components/dashboard/onboarding-checklist";
import { AdminStatsCards } from "@/components/admin/stats-cards";
import { UserTable, type UserRow } from "@/components/admin/user-table";
import { UserDetailSheet } from "@/components/admin/user-detail-sheet";
import {
  SubscriptionPieChart,
  type PlanDistribution,
} from "@/components/admin/subscription-pie-chart";
import { RevenueLineChart, type RevenuePoint } from "@/components/admin/revenue-line-chart";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AuditLog, type AuditEntry } from "@/components/admin/audit-log";
import { WaitlistTable, type WaitlistEntry } from "@/components/admin/waitlist-table";
import type { DateRange } from "react-day-picker";
import type { ActivityItem } from "@/components/dashboard/activity-feed";

// ─── Mock Data ────────────────────────────────────────────

const now = new Date();
function daysAgo(n: number) {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function hoursAgo(n: number) {
  const d = new Date(now);
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

const mockUsageData = Array.from({ length: 14 }, (_, i) => ({
  date: daysAgo(13 - i).slice(0, 10),
  tokens: Math.floor(Math.random() * 8000) + 1000,
}));

const mockActivities: ActivityItem[] = [
  { id: "1", type: "login", title: "Login berhasil", description: "Chrome · macOS", created_at: hoursAgo(1) },
  { id: "2", type: "payment", title: "Pembayaran Rp 99.000", description: "Upgrade ke Pro", created_at: hoursAgo(5) },
  { id: "3", type: "ai_usage", title: "AI Chat — 1.240 token", description: "Model: GPT-4o", created_at: hoursAgo(12) },
  { id: "4", type: "profile_update", title: "Profil diperbarui", description: "Nama lengkap diubah", created_at: daysAgo(1) },
  { id: "5", type: "login", title: "Login berhasil", description: "Safari · iOS", created_at: daysAgo(2) },
];

const mockNotifications: Notification[] = [
  { id: "1", title: "Pembayaran berhasil", body: "Paket Pro aktif hingga 17 Apr 2026.", read: false, created_at: hoursAgo(2) },
  { id: "2", title: "Kuota hampir habis", body: "85% token AI sudah terpakai bulan ini.", read: false, created_at: hoursAgo(8) },
  { id: "3", title: "Fitur baru: AI Generate", body: "Coba fitur text generation baru di dashboard.", read: true, created_at: daysAgo(3) },
];

const mockOnboardingSteps: OnboardingStep[] = [
  { id: "1", label: "Buat akun", completed: true },
  { id: "2", label: "Verifikasi email", description: "Cek inbox untuk link verifikasi", completed: true },
  { id: "3", label: "Pilih paket", description: "Pilih paket yang sesuai kebutuhan kamu", href: "/#pricing", completed: false },
  { id: "4", label: "Coba AI Chat", description: "Mulai percakapan pertama dengan AI", href: "/dashboard/chat", completed: false },
  { id: "5", label: "Lengkapi profil", description: "Tambahkan nama dan foto profil", href: "/dashboard/settings", completed: false },
];

const mockUsers: UserRow[] = Array.from({ length: 25 }, (_, i) => ({
  id: `user-${i + 1}`,
  email: `user${i + 1}@example.com`,
  full_name: i % 3 === 0 ? null : `User ${i + 1}`,
  plan: ["FREE", "BASIC", "PRO", "ULTIMATE"][i % 4],
  role: i % 5 === 0 ? "admin" : "member",
  status: "ACTIVE",
  created_at: daysAgo(Math.floor(Math.random() * 90)),
}));

const mockPieData: PlanDistribution[] = [
  { plan: "FREE", count: 120 },
  { plan: "BASIC", count: 45 },
  { plan: "PRO", count: 30 },
  { plan: "ULTIMATE", count: 8 },
];

const mockRevenueComparison: RevenuePoint[] = Array.from({ length: 14 }, (_, i) => ({
  date: daysAgo(13 - i).slice(0, 10),
  current: Math.floor(Math.random() * 5_000_000) + 500_000,
  previous: Math.floor(Math.random() * 4_000_000) + 300_000,
}));

const mockAuditEntries: AuditEntry[] = [
  { id: "a1", type: "user.signup", actor_email: "new@example.com", description: "Pengguna baru mendaftar", created_at: hoursAgo(1) },
  { id: "a2", type: "payment.success", actor_email: "pro@example.com", description: "Pembayaran Rp 99.000 berhasil", created_at: hoursAgo(3) },
  { id: "a3", type: "subscription.change", actor_email: "pro@example.com", description: "Upgrade dari Basic ke Pro", created_at: hoursAgo(3) },
  { id: "a4", type: "user.login", actor_email: "admin@kilatkoding.com", description: "Login dari 103.28.x.x", created_at: hoursAgo(6) },
  { id: "a5", type: "admin.action", actor_email: "admin@kilatkoding.com", description: "Approve waitlist user@example.com", created_at: hoursAgo(8) },
  { id: "a6", type: "payment.failed", actor_email: "fail@example.com", description: "Pembayaran Rp 49.000 gagal — kartu ditolak", created_at: daysAgo(1) },
  { id: "a7", type: "user.signup", actor_email: "another@example.com", description: "Pengguna baru mendaftar", created_at: daysAgo(2) },
];

const mockWaitlist: WaitlistEntry[] = Array.from({ length: 18 }, (_, i) => ({
  id: `wl-${i + 1}`,
  email: `waitlist${i + 1}@example.com`,
  name: i % 4 === 0 ? null : `Pendaftar ${i + 1}`,
  wa: i % 3 === 0 ? null : `08123456${String(i + 1).padStart(4, "0")}`,
  created_at: daysAgo(Math.floor(Math.random() * 30)),
}));

// ─── Section Wrapper ──────────────────────────────────────

function ShowcaseSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Badge variant="outline" className="text-[10px]">
            {id}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────

export function ComponentShowcase() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [toolbarSearch, setToolbarSearch] = useState("");
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }
  function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function handleViewUser(user: UserRow) {
    setSelectedUser(user);
    setSheetOpen(true);
  }

  const userDetail = selectedUser
    ? {
        ...selectedUser,
        avatar_image_url: null,
        current_period_end: daysAgo(-30),
        payments: [
          { id: "p1", amount: 99_000, status: "PAID", provider: "manual", created_at: daysAgo(5) },
          { id: "p2", amount: 49_000, status: "PAID", provider: "manual", created_at: daysAgo(35) },
        ],
      }
    : null;

  return (
    <div className="flex flex-col gap-8">
      <CommandPalette />

      {/* Header */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Component Showcase</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Component Showcase</h1>
        <p className="text-muted-foreground text-sm mt-1">
          24 komponen dashboard & admin dengan data mock. Tekan{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">⌘K</kbd>{" "}
          untuk Command Palette.
        </p>
      </div>

      <Separator />

      {/* ─── SHARED UTILITIES ─── */}
      <div>
        <h2 className="text-xl font-bold mb-6">Shared Utilities</h2>
        <div className="flex flex-col gap-8">

          <ShowcaseSection
            id="stats-grid"
            title="StatsGrid"
            description="Reusable stats card grid with loading state and optional icons/descriptions."
          >
            <div className="space-y-4">
              <StatsGrid
                items={[
                  { label: "Total Users", value: "203" },
                  { label: "Revenue", value: "Rp 12.5jt" },
                  { label: "Active Subs", value: "78" },
                  { label: "AI Tokens", value: "1.2M" },
                ]}
              />
              <p className="text-xs text-muted-foreground">Loading state:</p>
              <StatsGrid items={[]} loading columns={4} />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="empty-state"
            title="EmptyState"
            description="Zero-state placeholder with icon, text, and optional CTA."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-lg">
                <EmptyState
                  icon={<InboxIcon className="h-6 w-6" />}
                  title="Belum ada data"
                  description="Data akan muncul di sini setelah kamu mulai menggunakan fitur ini."
                  actionLabel="Mulai Sekarang"
                  actionHref="/dashboard"
                />
              </div>
              <div className="border rounded-lg">
                <EmptyState
                  icon={<PackageIcon className="h-6 w-6" />}
                  title="Tidak ada produk"
                  description="Tambahkan produk pertamamu."
                />
              </div>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="payment-status-badge"
            title="PaymentStatusBadge"
            description="Centralized status→variant mapping with optional Indonesian labels."
          >
            <div className="flex flex-wrap gap-2">
              {["PAID", "SUCCESS", "ACTIVE", "PENDING", "CANCELED", "FAILED", "EXPIRED", "UNPAID"].map(
                (s) => (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <PaymentStatusBadge status={s} />
                    <PaymentStatusBadge status={s} showLabel />
                  </div>
                )
              )}
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="date-range-picker"
            title="DateRangePicker"
            description="Indonesian-locale date range picker using date-fns."
          >
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </ShowcaseSection>

          <ShowcaseSection
            id="data-table-toolbar"
            title="DataTableToolbar"
            description="Search + filter bar pattern for tables."
          >
            <DataTableToolbar
              searchValue={toolbarSearch}
              onSearchChange={setToolbarSearch}
              searchPlaceholder="Cari pengguna..."
              filters={[
                {
                  value: "ALL",
                  onChange: () => {},
                  placeholder: "Status",
                  options: [
                    { label: "Semua", value: "ALL" },
                    { label: "Aktif", value: "ACTIVE" },
                    { label: "Inactive", value: "INACTIVE" },
                  ],
                },
              ]}
            >
              <ExportButton onExport={() => {}} />
            </DataTableToolbar>
          </ShowcaseSection>
        </div>
      </div>

      <Separator />

      {/* ─── DASHBOARD COMPONENTS ─── */}
      <div>
        <h2 className="text-xl font-bold mb-6">Dashboard Components</h2>
        <div className="flex flex-col gap-8">

          <ShowcaseSection
            id="usage-chart"
            title="UsageChart"
            description="Area chart for AI token usage over time."
          >
            <UsageChart data={mockUsageData} />
          </ShowcaseSection>

          <ShowcaseSection
            id="usage-meter"
            title="UsageMeter"
            description="Plan-aware usage progress bar with color-coded warnings."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <UsageMeter used={0} plan="FREE" />
              <UsageMeter used={7500} plan="BASIC" />
              <UsageMeter used={92000} plan="PRO" />
              <UsageMeter used={450000} plan="ULTIMATE" />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="activity-feed"
            title="ActivityFeed"
            description="Timeline of user events with relative timestamps."
          >
            <div className="max-w-md">
              <ActivityFeed activities={mockActivities} />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="quick-actions"
            title="QuickActions"
            description="4-card shortcut grid for common actions."
          >
            <QuickActions />
          </ShowcaseSection>

          <ShowcaseSection
            id="plan-comparison-modal"
            title="PlanComparisonModal"
            description="Dialog comparing all plan tiers. Click the button to open."
          >
            <PlanComparisonModal currentPlan="PRO" />
          </ShowcaseSection>

          <ShowcaseSection
            id="profile-avatar"
            title="ProfileAvatar"
            description="Editable avatar with upload button. Three sizes: sm, md, lg."
          >
            <div className="flex items-end gap-6">
              <ProfileAvatar fallback="GA" size="sm" />
              <ProfileAvatar fallback="GA" size="md" />
              <ProfileAvatar
                fallback="GA"
                size="lg"
                editable
                onUpload={async () => {
                  await new Promise((r) => setTimeout(r, 1000));
                }}
              />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="notification-dropdown"
            title="NotificationDropdown"
            description="Bell icon popover with unread count and mark-all-read."
          >
            <div className="flex items-center gap-4">
              <NotificationDropdown
                notifications={notifications}
                onMarkAllRead={handleMarkAllRead}
                onMarkRead={handleMarkRead}
              />
              <span className="text-xs text-muted-foreground">
                ← Klik bell icon
              </span>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="onboarding-checklist"
            title="OnboardingChecklist"
            description="Dismissible checklist with progress bar. Auto-hides when all done."
          >
            <div className="max-w-md">
              <OnboardingChecklist steps={mockOnboardingSteps} onDismiss={() => {}} />
            </div>
          </ShowcaseSection>
        </div>
      </div>

      <Separator />

      {/* ─── ADMIN COMPONENTS ─── */}
      <div>
        <h2 className="text-xl font-bold mb-6">Admin Components</h2>
        <div className="flex flex-col gap-8">

          <ShowcaseSection
            id="admin-stats-cards"
            title="AdminStatsCards"
            description="4-column stats with trend arrows (% change vs previous month)."
          >
            <AdminStatsCards
              stats={[
                { label: "Total Revenue", value: "Rp 12.5jt", change: 12.5 },
                { label: "Active Subs", value: "78", change: 8.3 },
                { label: "Paid Plans", value: "53", change: -2.1 },
                { label: "Free Plans", value: "150", change: 15.0 },
              ]}
            />
          </ShowcaseSection>

          <ShowcaseSection
            id="user-table"
            title="UserTable"
            description="Paginated, searchable, filterable user table with export."
          >
            <UserTable users={mockUsers} onViewUser={handleViewUser} />
            <UserDetailSheet
              user={userDetail}
              open={sheetOpen}
              onOpenChange={setSheetOpen}
            />
          </ShowcaseSection>

          <ShowcaseSection
            id="subscription-pie-chart"
            title="SubscriptionPieChart"
            description="Donut chart showing plan distribution."
          >
            <div className="max-w-md">
              <SubscriptionPieChart data={mockPieData} />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="revenue-line-chart"
            title="RevenueLineChart"
            description="Current vs previous month revenue comparison."
          >
            <RevenueLineChart data={mockRevenueComparison} />
          </ShowcaseSection>

          <ShowcaseSection
            id="admin-sidebar"
            title="AdminSidebar"
            description="Collapsible sidebar nav. Click the chevron to toggle."
          >
            <div className="h-[400px] border rounded-lg overflow-hidden">
              <AdminSidebar />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="audit-log"
            title="AuditLog"
            description="Searchable event timeline with type badges."
          >
            <AuditLog entries={mockAuditEntries} />
          </ShowcaseSection>

          <ShowcaseSection
            id="waitlist-table"
            title="WaitlistTable"
            description="Searchable waitlist with approve/remove actions and export."
          >
            <WaitlistTable
              entries={mockWaitlist}
              onApprove={() => {}}
              onRemove={() => {}}
            />
          </ShowcaseSection>
        </div>
      </div>
    </div>
  );
}
