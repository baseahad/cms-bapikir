import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FeatureNotice } from "@/components/config/feature-notice";
import { createClient } from "@/lib/supabase/server";
import { getFeatureAvailability } from "@/lib/config/features";
import { hasEnvVars } from "@/lib/utils";
import {
  paidPlans,
  planLabels,
} from "@/config/subscriptions";
import { SupabaseEnvNotice } from "@/components/auth/supabase-env-notice";
import { PlanComparisonModal } from "@/components/dashboard/plan-comparison-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { PaymentButton } from "@/components/dashboard/payment-button";
import { SubscriptionManageButton } from "@/components/dashboard/subscription-manage-button";
import {
  getSubscriptionByUserId,
  isPaidPlan,
  isProPlan,
  syncExpiredSubscription,
} from "@/lib/data/subscriptions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Billing — CMS Bapikir",
  description: "Kelola paket aktif dan pembayaran.",
  path: "/dashboard/billing",
  noIndex: true,
});

type Subscription = {
  cancel_at_period_end: boolean;
  plan: string;
  status: string;
  current_period_end: string | null;
};

async function BillingContent() {
  if (!hasEnvVars) return <SupabaseEnvNotice />;

  const billingFeature = getFeatureAvailability("billing");
  const paymentsFeature = getFeatureAvailability("payments");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) redirect("/auth/login");

  const userId = data.claims.sub as string;
  await syncExpiredSubscription(userId);

  const sub = (await getSubscriptionByUserId(supabase, userId)) as Subscription | null;

  const isPaid = isPaidPlan((sub?.plan as "FREE" | "BASIC" | "PRO" | "ULTIMATE") ?? "FREE");
  const isPro = isProPlan((sub?.plan as "FREE" | "BASIC" | "PRO" | "ULTIMATE") ?? "FREE");
  const isActive = sub?.status === "ACTIVE";
  const currentPlan = (sub?.plan as "FREE" | "BASIC" | "PRO" | "ULTIMATE" | undefined) ?? "FREE";

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Billing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola subscription dan pembayaran kamu.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <PlanComparisonModal currentPlan={currentPlan} />
        {billingFeature.enabled && isPaid && !sub?.cancel_at_period_end && (
          <SubscriptionManageButton
            action="cancel"
            label="Batalkan di akhir periode"
            pendingLabel="Menyimpan..."
            successMessage="Subscription akan berakhir di akhir periode aktif."
          />
        )}
        {billingFeature.enabled && sub?.cancel_at_period_end && (
          <SubscriptionManageButton
            action="resume"
            label="Lanjutkan subscription"
            pendingLabel="Menyimpan..."
            successMessage="Subscription aktif kembali dan tidak jadi dibatalkan."
            variant="secondary"
          />
        )}
      </div>

      {!billingFeature.enabled ? (
        <FeatureNotice
          description={billingFeature.message}
          missingEnv={billingFeature.missingEnv}
          title={billingFeature.title}
          toggleEnv={billingFeature.toggleEnv}
        />
      ) : null}

      <Separator />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Plan Saat Ini</CardTitle>
            <div className="flex gap-2">
              <Badge variant={isPaid ? "default" : "secondary"}>
                {planLabels[currentPlan]}
              </Badge>
              {sub?.status && (
                <Badge variant={isActive ? "outline" : "destructive"}>
                  {sub.status}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sub?.current_period_end && (
            <p className="text-sm text-muted-foreground mb-4">
              Periode berakhir:{" "}
              {new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(sub.current_period_end))}
            </p>
          )}

          {isPro ? (
            <p className="text-sm text-muted-foreground">
              Kamu sudah di plan {planLabels[currentPlan]}. Terima kasih telah mendukung CMS Bapikir!
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Upgrade ke Pro untuk akses semua fitur.
            </p>
          )}

          {sub?.cancel_at_period_end && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-3">
              Subscription akan otomatis kembali ke Free saat periode saat ini berakhir.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {paidPlans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.plan && isActive && !sub?.cancel_at_period_end;

          return (
            <Card
              key={plan.plan}
              className={plan.plan === "PRO" ? "border-primary/50" : undefined}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">{plan.title}</CardTitle>
                  <div className="text-right">
                    <span className="text-2xl font-bold">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(plan.price)}
                    </span>
                    <span className="text-muted-foreground text-sm">{plan.intervalLabel}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {isCurrentPlan ? (
                  <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                    Plan ini sedang aktif di akun kamu.
                  </div>
                ) : !paymentsFeature.enabled ? (
                  <div className="space-y-2">
                    <div className="rounded-md border border-dashed bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                      {paymentsFeature.title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {paymentsFeature.message}
                    </p>
                  </div>
                ) : (
                  <PaymentButton
                    config={{
                      amount: plan.price,
                      items: plan.items,
                      label: `Pilih ${plan.title}`,
                      plan: plan.plan,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  );
}
