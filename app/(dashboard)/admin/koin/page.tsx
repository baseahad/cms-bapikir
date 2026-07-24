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
import { KoinTopupTable } from "@/components/admin/koin-topup-table";
import { getFeatureAvailability } from "@/lib/config/features";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { listPendingTopupRequestsForAdmin } from "@/lib/data/koin-topup";
import { isAdminUser } from "@/lib/data/user-roles";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Top-up Koin — Admin",
  description: "Verifikasi permintaan top-up Koin Bapikir dari user.",
  path: "/admin/koin",
  noIndex: true,
});

async function KoinAdminContent() {
  const koinFeature = getFeatureAvailability("koin");
  if (!koinFeature.enabled) {
    return (
      <FeatureNotice
        description={koinFeature.message}
        missingEnv={koinFeature.missingEnv}
        title={koinFeature.title}
        toggleEnv={koinFeature.toggleEnv}
      />
    );
  }

  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");

  if (!(await isAdminUser(user.id, user.email))) {
    redirect("/dashboard");
  }

  const requests = await listPendingTopupRequestsForAdmin();

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
            <BreadcrumbPage>Top-up Koin</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Top-up Koin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verifikasi bukti transfer dan setujui atau tolak permintaan top-up user.
        </p>
      </div>

      <KoinTopupTable requests={requests} />
    </div>
  );
}

export default function KoinAdminPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <KoinAdminContent />
    </Suspense>
  );
}
