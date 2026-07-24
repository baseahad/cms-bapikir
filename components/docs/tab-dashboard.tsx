"use client";

import { useState } from "react";
import { ComponentDemo, DemoSection } from "./component-demo";
import { InboxIcon, PackageIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { StatsGrid } from "@/components/dashboard/stats-grid";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PaymentStatusBadge } from "@/components/dashboard/payment-status-badge";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { DataTableToolbar } from "@/components/dashboard/data-table-toolbar";
import { ExportButton } from "@/components/dashboard/export-button";
import { UsageChart, type UsageDataPoint } from "@/components/dashboard/usage-chart";
import { UsageMeter } from "@/components/dashboard/usage-meter";
import {
  ActivityFeed,
  type ActivityItem,
} from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PlanComparisonModal } from "@/components/dashboard/plan-comparison-modal";
import { ProfileAvatar } from "@/components/dashboard/profile-avatar";
import {
  NotificationDropdown,
  type Notification,
} from "@/components/dashboard/notification-dropdown";
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
import {
  RevenueLineChart,
  type RevenuePoint,
} from "@/components/admin/revenue-line-chart";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AuditLog, type AuditEntry } from "@/components/admin/audit-log";
import { WaitlistTable, type WaitlistEntry } from "@/components/admin/waitlist-table";

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

const mockUsageData: UsageDataPoint[] = Array.from({ length: 14 }, (_, i) => ({
  date: daysAgo(13 - i).slice(0, 10),
  tokens: Math.floor(Math.random() * 8000) + 1000,
}));

const mockActivities: ActivityItem[] = [
  { id: "1", type: "login", title: "Login berhasil", description: "Chrome · macOS", created_at: hoursAgo(1) },
  { id: "2", type: "payment", title: "Pembayaran Rp 99.000", description: "Upgrade ke Pro", created_at: hoursAgo(5) },
  { id: "3", type: "ai_usage", title: "AI Chat — 1.240 token", created_at: hoursAgo(12) },
  { id: "4", type: "profile_update", title: "Profil diperbarui", created_at: daysAgo(1) },
];

const mockNotifications: Notification[] = [
  { id: "1", title: "Pembayaran berhasil", body: "Paket Pro aktif.", read: false, created_at: hoursAgo(2) },
  { id: "2", title: "Kuota hampir habis", read: false, created_at: hoursAgo(8) },
  { id: "3", title: "Fitur baru: AI Generate", read: true, created_at: daysAgo(3) },
];

const mockOnboardingSteps: OnboardingStep[] = [
  { id: "1", label: "Buat akun", completed: true },
  { id: "2", label: "Verifikasi email", completed: true },
  { id: "3", label: "Pilih paket", href: "/#pricing", completed: false },
  { id: "4", label: "Coba AI Chat", href: "/dashboard/chat", completed: false },
];

const mockUsers: UserRow[] = Array.from({ length: 12 }, (_, i) => ({
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
  { id: "a5", type: "admin.action", actor_email: "admin@kilatkoding.com", description: "Approve waitlist user", created_at: hoursAgo(8) },
];

const mockWaitlist: WaitlistEntry[] = Array.from({ length: 8 }, (_, i) => ({
  id: `wl-${i + 1}`,
  email: `waitlist${i + 1}@example.com`,
  name: i % 4 === 0 ? null : `Pendaftar ${i + 1}`,
  wa: i % 3 === 0 ? null : `08123456${String(i + 1).padStart(4, "0")}`,
  created_at: daysAgo(Math.floor(Math.random() * 30)),
}));

// ─── Tab Component ────────────────────────────────────────

export function DashboardTab() {
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
    <div className="space-y-10">
      {/* ─── SHARED UTILITIES ─── */}
      <DemoSection title="StatsGrid" columns={1}>
        <ComponentDemo
          title="Default"
          description="4-column stats grid with icons"
          className="block"
        >
          <StatsGrid
            items={[
              { label: "Total Users", value: "203" },
              { label: "Revenue", value: "Rp 12.5jt" },
              { label: "Active Subs", value: "78" },
              { label: "AI Tokens", value: "1.2M" },
            ]}
          />
        </ComponentDemo>
        <ComponentDemo
          title="Loading"
          description="Skeleton loading state"
          className="block"
        >
          <StatsGrid items={[]} loading columns={4} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="EmptyState" columns={1}>
        <ComponentDemo
          title="With action"
          description="Empty state with CTA button"
          className="block"
        >
          <EmptyState
            icon={<InboxIcon className="h-6 w-6" />}
            title="Belum ada data"
            description="Data akan muncul di sini setelah kamu mulai."
            actionLabel="Mulai Sekarang"
            actionHref="/dashboard"
          />
        </ComponentDemo>
        <ComponentDemo
          title="Without action"
          description="Minimal empty state"
          className="block"
        >
          <EmptyState
            icon={<PackageIcon className="h-6 w-6" />}
            title="Tidak ada produk"
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="PaymentStatusBadge" columns={1}>
        <ComponentDemo
          title="Status codes"
          description="All payment status variants"
        >
          {["PAID", "SUCCESS", "ACTIVE", "PENDING", "CANCELED", "FAILED", "EXPIRED"].map(
            (s) => (
              <PaymentStatusBadge key={s} status={s} />
            )
          )}
        </ComponentDemo>
        <ComponentDemo
          title="With labels"
          description="Indonesian translated labels"
        >
          {["PAID", "PENDING", "FAILED", "EXPIRED"].map((s) => (
            <PaymentStatusBadge key={s} status={s} showLabel />
          ))}
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="DateRangePicker" columns={1}>
        <ComponentDemo
          title="Interactive"
          description="Indonesian-locale calendar range picker"
        >
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="DataTableToolbar + ExportButton" columns={1}>
        <ComponentDemo
          title="Combined"
          description="Search bar with filter dropdown and export"
          className="block"
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
                ],
              },
            ]}
          >
            <ExportButton onExport={() => {}} />
          </DataTableToolbar>
        </ComponentDemo>
      </DemoSection>

      {/* ─── DASHBOARD COMPONENTS ─── */}
      <DemoSection title="UsageChart" columns={1}>
        <ComponentDemo
          title="Area chart"
          description="AI token usage over 14 days"
          className="block"
        >
          <UsageChart data={mockUsageData} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="UsageMeter" columns={1}>
        <ComponentDemo
          title="Plan states"
          description="Free, Basic (75%), Pro (92%), Ultimate (unlimited)"
          className="block"
        >
          <div className="grid grid-cols-2 gap-3 w-full">
            <UsageMeter used={0} plan="FREE" />
            <UsageMeter used={7500} plan="BASIC" />
            <UsageMeter used={92000} plan="PRO" />
            <UsageMeter used={450000} plan="ULTIMATE" />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="ActivityFeed" columns={1}>
        <ComponentDemo
          title="Recent events"
          description="Timeline with typed icons and relative time"
          className="block"
        >
          <ActivityFeed activities={mockActivities} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="QuickActions" columns={1}>
        <ComponentDemo
          title="Action cards"
          description="Shortcut grid for common dashboard actions"
          className="block"
        >
          <QuickActions />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="PlanComparisonModal" columns={1}>
        <ComponentDemo
          title="Plan comparison"
          description="Click to open the comparison dialog"
        >
          <PlanComparisonModal currentPlan="PRO" />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="ProfileAvatar" columns={1}>
        <ComponentDemo
          title="Sizes"
          description="sm, md, lg — the lg variant supports upload"
        >
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
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="NotificationDropdown" columns={1}>
        <ComponentDemo
          title="Bell icon"
          description="Click to see notification popover"
        >
          <NotificationDropdown
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            onMarkRead={handleMarkRead}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="OnboardingChecklist" columns={1}>
        <ComponentDemo
          title="Checklist"
          description="Dismissible checklist with progress tracking"
          className="block"
        >
          <div className="max-w-md mx-auto">
            <OnboardingChecklist steps={mockOnboardingSteps} onDismiss={() => {}} />
          </div>
        </ComponentDemo>
      </DemoSection>

      {/* ─── ADMIN COMPONENTS ─── */}
      <DemoSection title="AdminStatsCards" columns={1}>
        <ComponentDemo
          title="With trends"
          description="Stats with percentage change arrows"
          className="block"
        >
          <AdminStatsCards
            stats={[
              { label: "Total Revenue", value: "Rp 12.5jt", change: 12.5 },
              { label: "Active Subs", value: "78", change: 8.3 },
              { label: "Paid Plans", value: "53", change: -2.1 },
              { label: "Free Plans", value: "150", change: 15.0 },
            ]}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="UserTable + UserDetailSheet" columns={1}>
        <ComponentDemo
          title="Interactive table"
          description="Searchable, filterable with export — click eye icon to open detail sheet"
          className="block"
        >
          <UserTable users={mockUsers} onViewUser={handleViewUser} />
          <UserDetailSheet
            user={userDetail}
            open={sheetOpen}
            onOpenChange={setSheetOpen}
          />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="SubscriptionPieChart" columns={1}>
        <ComponentDemo
          title="Plan distribution"
          description="Donut chart showing user plan breakdown"
          className="block"
        >
          <div className="max-w-sm mx-auto">
            <SubscriptionPieChart data={mockPieData} />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="RevenueLineChart" columns={1}>
        <ComponentDemo
          title="Revenue comparison"
          description="Current vs previous month line chart"
          className="block"
        >
          <RevenueLineChart data={mockRevenueComparison} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="AdminSidebar" columns={1}>
        <ComponentDemo
          title="Collapsible"
          description="Click chevron to toggle collapse"
          className="block p-0 overflow-hidden"
        >
          <div className="h-[350px]">
            <AdminSidebar />
          </div>
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="AuditLog" columns={1}>
        <ComponentDemo
          title="Event timeline"
          description="Searchable audit log with typed event badges"
          className="block"
        >
          <AuditLog entries={mockAuditEntries} />
        </ComponentDemo>
      </DemoSection>

      <DemoSection title="WaitlistTable" columns={1}>
        <ComponentDemo
          title="Waitlist management"
          description="Searchable with approve/remove actions and export"
          className="block"
        >
          <WaitlistTable
            entries={mockWaitlist}
            onApprove={() => {}}
            onRemove={() => {}}
          />
        </ComponentDemo>
      </DemoSection>
    </div>
  );
}
