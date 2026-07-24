import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FeatureNotice } from "@/components/config/feature-notice";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { ManualPaymentTable } from "@/components/admin/manual-payment-table";
import { getFeatureAvailability } from "@/lib/config/features";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { listPendingManualPaymentsForAdmin } from "@/lib/data/payments";
import { isAdminUser } from "@/lib/data/user-roles";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Pembayaran — Admin",
  description: "Verifikasi transfer manual untuk subscription (MALIYA CENTER).",
  path: "/admin/payments",
  noIndex: true,
});

async function PaymentsAdminContent() {
  const paymentsFeature = getFeatureAvailability("payments");
  if (!paymentsFeature.enabled) {
    return (
      <FeatureNotice
        description={paymentsFeature.message}
        missingEnv={paymentsFeature.missingEnv}
        title={paymentsFeature.title}
        toggleEnv={paymentsFeature.toggleEnv}
      />
    );
  }

  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

  if (!(await isAdminUser(user.id, user.email))) {
    redirect("/dashboard");
  }

  const payments = await listPendingManualPaymentsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pembayaran</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Pembayaran</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verifikasi bukti transfer manual dan setujui atau tolak subscription user.
        </p>
      </div>

      <ManualPaymentTable payments={payments} />
    </div>
  );
}

export default function PaymentsAdminPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <PaymentsAdminContent />
    </Suspense>
  );
}
