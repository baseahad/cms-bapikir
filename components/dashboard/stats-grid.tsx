"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type StatItem = {
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
};

export function StatsGrid({
  items,
  loading = false,
  columns = 4,
}: {
  items: StatItem[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
}) {
  const colClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";

  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 gap-4", colClass)}>
        {Array.from({ length: columns }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-1">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4", colClass)}>
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              {item.icon}
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.value}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {item.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
