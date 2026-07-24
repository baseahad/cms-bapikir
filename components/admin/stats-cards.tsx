import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSignIcon,
  UsersIcon,
  CreditCardIcon,
  UserIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type AdminStat = {
  label: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
};

const defaultIcons = [
  <DollarSignIcon key="rev" className="h-4 w-4" />,
  <UsersIcon key="sub" className="h-4 w-4" />,
  <CreditCardIcon key="paid" className="h-4 w-4" />,
  <UserIcon key="free" className="h-4 w-4" />,
];

export function AdminStatsCards({ stats }: { stats: AdminStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <div className="text-muted-foreground">
              {stat.icon ?? defaultIcons[i % defaultIcons.length]}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stat.value}</p>
            {stat.change !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                {stat.change >= 0 ? (
                  <ArrowUpIcon className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    stat.change >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-destructive"
                  )}
                >
                  {Math.abs(stat.change)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs bulan lalu
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
