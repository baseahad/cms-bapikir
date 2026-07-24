"use client";

import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  CreditCardIcon,
  LogInIcon,
  SparklesIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type ActivityType = "login" | "payment" | "ai_usage" | "profile_update";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  created_at: string;
};

const activityIcons: Record<ActivityType, LucideIcon> = {
  login: LogInIcon,
  payment: CreditCardIcon,
  ai_usage: SparklesIcon,
  profile_update: UserIcon,
};

const activityColors: Record<ActivityType, string> = {
  login: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  payment:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ai_usage:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  profile_update:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export function ActivityFeed({
  activities,
  loading = false,
  limit = 5,
}: {
  activities: ActivityItem[];
  loading?: boolean;
  limit?: number;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const items = activities.slice(0, limit);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
        ) : (
          <div className="space-y-4">
            {items.map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div key={activity.id} className="flex gap-3 items-start">
                  <div
                    className={cn(
                      "rounded-full p-1.5 shrink-0",
                      activityColors[activity.type]
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {activity.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
