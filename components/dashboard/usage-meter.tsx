"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PLAN_LIMITS: Record<string, number> = {
  FREE: 0,
  BASIC: 10_000,
  PRO: 100_000,
  ULTIMATE: Infinity,
};

function formatTokens(v: number) {
  if (v === Infinity) return "∞";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(v);
}

export function UsageMeter({
  used,
  plan,
  loading = false,
}: {
  used: number;
  plan: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  const limit = PLAN_LIMITS[plan] ?? 0;
  const isUnlimited = limit === Infinity;
  const percentage = isUnlimited ? 0 : limit > 0 ? (used / limit) * 100 : 100;
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage >= 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Kuota Token AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Terpakai bulan ini</span>
          <span className="font-medium">
            {formatTokens(used)} / {formatTokens(limit)}
          </span>
        </div>
        {!isUnlimited && (
          <Progress
            value={Math.min(percentage, 100)}
            className={cn(
              "h-2",
              isOverLimit && "[&>div]:bg-destructive",
              isNearLimit && !isOverLimit && "[&>div]:bg-yellow-500"
            )}
          />
        )}
        {isUnlimited && (
          <p className="text-xs text-muted-foreground">
            Paket Ultimate — penggunaan tidak terbatas.
          </p>
        )}
        {isOverLimit && (
          <p className="text-xs text-destructive">
            Kuota habis. Upgrade paket untuk melanjutkan.
          </p>
        )}
        {isNearLimit && !isOverLimit && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Kuota hampir habis ({Math.round(percentage)}% terpakai).
          </p>
        )}
      </CardContent>
    </Card>
  );
}
