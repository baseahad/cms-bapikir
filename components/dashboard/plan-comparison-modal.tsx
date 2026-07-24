"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { paidPlanCatalog } from "@/config/subscriptions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PlanFeature = {
  label: string;
  free: boolean | string;
  basic: boolean | string;
  pro: boolean | string;
  ultimate: boolean | string;
};

const features: PlanFeature[] = [
  {
    label: "AI Token / bulan",
    free: "0",
    basic: "10K",
    pro: "100K",
    ultimate: "Unlimited",
  },
  {
    label: "Dashboard",
    free: true,
    basic: true,
    pro: true,
    ultimate: true,
  },
  {
    label: "AI Chat",
    free: false,
    basic: true,
    pro: true,
    ultimate: true,
  },
  {
    label: "Text Generation",
    free: false,
    basic: true,
    pro: true,
    ultimate: true,
  },
  {
    label: "Prioritas Support",
    free: false,
    basic: false,
    pro: true,
    ultimate: true,
  },
  {
    label: "Custom Model",
    free: false,
    basic: false,
    pro: false,
    ultimate: true,
  },
];

const plans = [
  { key: "free" as const, label: "Free", price: "Gratis" },
  {
    key: "basic" as const,
    label: paidPlanCatalog.BASIC.title,
    price: `Rp ${paidPlanCatalog.BASIC.price.toLocaleString("id-ID")}`,
  },
  {
    key: "pro" as const,
    label: paidPlanCatalog.PRO.title,
    price: `Rp ${paidPlanCatalog.PRO.price.toLocaleString("id-ID")}`,
  },
  {
    key: "ultimate" as const,
    label: paidPlanCatalog.ULTIMATE.title,
    price: `Rp ${paidPlanCatalog.ULTIMATE.price.toLocaleString("id-ID")}`,
  },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-xs font-medium">{value}</span>;
  }
  return value ? (
    <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto" />
  ) : (
    <XIcon className="h-4 w-4 text-muted-foreground/40 mx-auto" />
  );
}

export function PlanComparisonModal({
  currentPlan,
  children,
}: {
  currentPlan?: string;
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline" size="sm">
            Bandingkan Paket
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perbandingan Paket</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 pr-4 text-left font-medium text-muted-foreground">
                  Fitur
                </th>
                {plans.map((plan) => (
                  <th key={plan.key} className="py-3 px-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{plan.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {plan.price}
                      </span>
                      {currentPlan?.toUpperCase() ===
                        plan.key.toUpperCase() && (
                        <Badge variant="secondary" className="text-[10px]">
                          Aktif
                        </Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.label} className="border-b last:border-0">
                  <td className="py-3 pr-4 text-muted-foreground">
                    {feature.label}
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.key}
                      className={cn(
                        "py-3 px-2 text-center",
                        currentPlan?.toUpperCase() ===
                          plan.key.toUpperCase() && "bg-muted/50"
                      )}
                    >
                      <FeatureValue value={feature[plan.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
