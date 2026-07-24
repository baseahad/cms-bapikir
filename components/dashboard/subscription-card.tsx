"use client";

import Link from "next/link";
import { planLabels } from "@/config/subscriptions";
import { useSubscription } from "@/hooks/use-subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function daysRemaining(end: string | null): number {
  if (!end) return 0;
  const diff = new Date(end).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function periodProgress(start: string | null, end: string | null): number {
  if (!start || !end) return 0;
  const total = new Date(end).getTime() - new Date(start).getTime();
  const elapsed = Date.now() - new Date(start).getTime();
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  CANCELED: "secondary",
  PAST_DUE: "destructive",
  UNPAID: "destructive",
};

export function SubscriptionCard() {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-9 w-28" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          Data subscription tidak tersedia.
        </CardContent>
      </Card>
    );
  }

  const days = daysRemaining(subscription.current_period_end);
  const progress = periodProgress(
    subscription.current_period_start,
    subscription.current_period_end
  );
  const isPro = subscription.plan === "PRO" || subscription.plan === "ULTIMATE";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Subscription</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{planLabels[subscription.plan] ?? subscription.plan}</Badge>
            <Badge variant={statusVariant[subscription.status] ?? "secondary"}>
              {subscription.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-4">
        {subscription.current_period_end && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Periode aktif</span>
              <span>{days} hari tersisa</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
        {!isPro && (
          <Button size="sm" asChild>
            <Link href="/dashboard/billing">Upgrade Paket</Link>
          </Button>
        )}
        {subscription.cancel_at_period_end && (
          <p className="text-xs text-destructive">
            Subscription akan berakhir di akhir periode.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
