"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeftIcon,
  LayoutDashboardIcon,
  UsersIcon,
  CreditCardIcon,
  BarChart3Icon,
  ScrollTextIcon,
  MailIcon,
  SettingsIcon,
  PenLineIcon,
  ImageIcon,
  CoinsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: <LayoutDashboardIcon className="h-4 w-4" />,
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: <PenLineIcon className="h-4 w-4" />,
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    label: "Pengguna",
    href: "/admin/users",
    icon: <UsersIcon className="h-4 w-4" />,
  },
  {
    label: "Pembayaran",
    href: "/admin/payments",
    icon: <CreditCardIcon className="h-4 w-4" />,
  },
  {
    label: "Top-up Koin",
    href: "/admin/koin",
    icon: <CoinsIcon className="h-4 w-4" />,
  },
  {
    label: "Revenue",
    href: "/admin/revenue",
    icon: <BarChart3Icon className="h-4 w-4" />,
  },
  {
    label: "Audit Log",
    href: "/admin/audit",
    icon: <ScrollTextIcon className="h-4 w-4" />,
  },
  {
    label: "Waitlist",
    href: "/admin/waitlist",
    icon: <MailIcon className="h-4 w-4" />,
  },
  {
    label: "Pengaturan",
    href: "/admin/settings",
    icon: <SettingsIcon className="h-4 w-4" />,
  },
];

export function AdminSidebar({
  items = sidebarItems,
}: {
  items?: SidebarItem[];
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-200",
        collapsed ? "w-14" : "w-56"
      )}
    >
      <div className="flex items-center justify-between px-3 py-4">
        {!collapsed && (
          <span className="text-sm font-semibold">Admin</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCollapsed((c) => !c)}
        >
          <ChevronLeftIcon
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
