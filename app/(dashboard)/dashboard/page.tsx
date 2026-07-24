import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SupabaseEnvNotice } from "@/components/auth/supabase-env-notice";
import { getProfileForCurrentUser } from "@/lib/data/profiles";
import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SubscriptionCard } from "@/components/dashboard/subscription-card";
import { PaymentsTable } from "@/components/dashboard/payments-table";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Dashboard — CMS Bapikir",
  description: "Ringkasan akun, paket aktif, dan riwayat pembayaran kamu.",
  path: "/dashboard",
  noIndex: true,
});

async function DashboardContent() {
  if (!hasEnvVars) {
    return <SupabaseEnvNotice />;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const email = data.claims.email as string;
  const userId = data.claims.sub as string;
  const profile = await getProfileForCurrentUser(userId);
  const displayName = profile?.full_name?.trim() || email;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-4">
        <Avatar className="h-11 w-11">
          {profile?.avatar_image_url && (
            <AvatarImage src={profile.avatar_image_url} alt={displayName} />
          )}
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold">Selamat datang kembali</h1>
          <p className="text-sm text-muted-foreground">{displayName}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SubscriptionCard />
      </div>

      <PaymentsTable />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <DashboardContent />
    </Suspense>
  );
}
