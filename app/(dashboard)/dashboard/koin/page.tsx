import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FeatureNotice } from "@/components/config/feature-notice";
import { SupabaseEnvNotice } from "@/components/auth/supabase-env-notice";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { getFeatureAvailability } from "@/lib/config/features";
import { hasEnvVars } from "@/lib/utils";
import { getKoinBalance, getKoinLedgerHistory, getMyPendingTopupRequest } from "@/lib/data/koin-topup";
import { paymentConfig } from "@/config/payment";
import { KoinLedgerTable } from "@/components/dashboard/koin-ledger-table";
import { KoinTopupPanel } from "@/components/dashboard/koin-topup-panel";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Koin Bapikir — Dashboard",
  description: "Saldo dan top-up Koin Bapikir.",
  path: "/dashboard/koin",
  noIndex: true,
});

async function KoinContent() {
  if (!hasEnvVars) return <SupabaseEnvNotice />;

  const koinFeature = getFeatureAvailability("koin");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/auth/login");

  const userId = data.claims.sub as string;

  const [balance, pendingRequest, ledgerHistory] = await Promise.all([
    getKoinBalance(userId, "bapikir"),
    getMyPendingTopupRequest(userId),
    getKoinLedgerHistory(userId, "bapikir"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Koin</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Koin Bapikir</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Saldo saat ini: <span className="font-semibold text-foreground">{balance.toLocaleString("id-ID")} Bp</span>
        </p>
      </div>

      {!koinFeature.enabled ? (
        <FeatureNotice
          description={koinFeature.message}
          missingEnv={koinFeature.missingEnv}
          title={koinFeature.title}
          toggleEnv={koinFeature.toggleEnv}
        />
      ) : (
        <KoinTopupPanel
          pendingRequest={pendingRequest}
          rekening={{
            bank: paymentConfig.bankName,
            nomor: paymentConfig.bankAccountNumber,
            atasNama: paymentConfig.bankAccountName,
            qris: paymentConfig.qrisImage,
          }}
        />
      )}

      {koinFeature.enabled && (
        <>
          <Separator />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Riwayat Transaksi</h2>
            <KoinLedgerTable entries={ledgerHistory} />
          </div>
        </>
      )}
    </div>
  );
}

export default function KoinPage() {
  return (
    <Suspense>
      <KoinContent />
    </Suspense>
  );
}
