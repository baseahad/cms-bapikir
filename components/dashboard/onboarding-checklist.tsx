"use client";

import { useState } from "react";
import { CheckCircle2Icon, CircleIcon, XIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type OnboardingStep = {
  id: string;
  label: string;
  description?: string;
  href?: string;
  completed: boolean;
};

export function OnboardingChecklist({
  steps,
  onDismiss,
}: {
  steps: OnboardingStep[];
  onDismiss?: () => void;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const completedCount = steps.filter((s) => s.completed).length;
  const allDone = completedCount === steps.length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  if (allDone) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Mulai di Sini</CardTitle>
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                setDismissed(true);
                onDismiss();
              }}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <Progress value={progress} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground shrink-0">
            {completedCount}/{steps.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.map((step) => {
          const isClickable = !step.completed && !!step.href;
          const content = (
            <>
              {step.completed ? (
                <CheckCircle2Icon className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              ) : (
                <CircleIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.completed && "line-through"
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </>
          );

          const className = cn(
            "flex items-start gap-3 rounded-lg border p-3 transition-colors",
            isClickable && "hover:bg-muted/50 cursor-pointer",
            step.completed && "opacity-60"
          );

          return isClickable ? (
            <Link key={step.id} href={step.href!} className={className}>
              {content}
            </Link>
          ) : (
            <div key={step.id} className={className}>
              {content}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
