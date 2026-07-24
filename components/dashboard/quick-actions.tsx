import Link from "next/link";
import {
  ArrowUpCircleIcon,
  CreditCardIcon,
  SettingsIcon,
  SparklesIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color?: string;
};

const defaultActions: QuickAction[] = [
  {
    label: "AI Chat",
    description: "Mulai percakapan AI baru",
    href: "/dashboard/chat",
    icon: <SparklesIcon className="h-5 w-5" />,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    label: "Upgrade",
    description: "Tingkatkan paket kamu",
    href: "/dashboard/billing",
    icon: <ArrowUpCircleIcon className="h-5 w-5" />,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Billing",
    description: "Riwayat pembayaran",
    href: "/dashboard/billing",
    icon: <CreditCardIcon className="h-5 w-5" />,
    color: "text-green-600 dark:text-green-400",
  },
  {
    label: "Pengaturan",
    description: "Profil dan keamanan",
    href: "/dashboard/settings",
    icon: <SettingsIcon className="h-5 w-5" />,
    color: "text-orange-600 dark:text-orange-400",
  },
];

export function QuickActions({
  actions = defaultActions,
}: {
  actions?: QuickAction[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => (
        <Link key={action.href + action.label} href={action.href}>
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-4 pb-3 px-4">
              <div className={cn("mb-2", action.color)}>{action.icon}</div>
              <p className="text-sm font-medium">{action.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {action.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
