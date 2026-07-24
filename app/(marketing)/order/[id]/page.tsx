import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ManualPaymentPanel } from "@/components/dashboard/manual-payment-panel";
import { PaymentStatusBadge } from "@/components/dashboard/payment-status-badge";
import { Separator } from "@/components/ui/separator";
import { TemplateBanner } from "@/components/ui/template-banner";
import { Check, Download, ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import Link from "next/link";
import { paymentConfig } from "@/config/payment";
import { planLabels } from "@/config/subscriptions";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { getOrderSummary } from "@/lib/data/payments";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Pesanan Berhasil — CMS Bapikir",
  description: "Konfirmasi pesanan dan langkah berikutnya setelah pembelian.",
  noIndex: true,
});

const nextSteps = [
  {
    icon: BookOpen,
    title: "Buka Dokumentasi",
    desc: "Mulai dari README — setup environment dan deploy pertama kamu.",
    href: "/docs/components",
    cta: "Lihat Docs",
  },
  {
    icon: Download,
    title: "Akses Source Code",
    desc: "Akses repository di dashboard kamu. Link juga dikirim ke email.",
    href: "/dashboard",
    cta: "Buka Dashboard",
  },
  {
    icon: MessageCircle,
    title: "Gabung Discord",
    desc: "Komunitas developer CMS Bapikir — tanya jawab, berbagi progress, dan networking.",
    href: "https://discord.gg/kilatkoding",
    cta: "Join Discord",
  },
];

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const { status: fallbackStatus } = await searchParams;
  const payment = await getOrderSummary(id);
  const status = payment?.status ?? fallbackStatus?.toUpperCase() ?? "PENDING";
  const isPaid = status === "PAID";

  const user = await getAuthenticatedUser();
  const showManualPanel =
    payment?.provider === "MANUAL" && status === "PENDING" && user?.id === payment.user_id;

  return (
    <>
      <TemplateBanner description="Halaman konfirmasi order untuk produkmu — sesuaikan next steps dan link setelah pembayaran berhasil" />
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-10 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <Badge
            variant="outline"
            className={
              isPaid
                ? "border-green-500/30 text-green-600 dark:text-green-400"
                : "border-yellow-500/30 text-yellow-600 dark:text-yellow-400"
            }
          >
            {isPaid ? "Pembayaran Berhasil" : "Pembayaran Diproses"}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            {isPaid
              ? "Selamat! Pembayaran kamu sudah kami terima."
              : "Pembayaran kamu sedang kami proses."}
          </h1>
          <p className="text-muted-foreground">
            {isPaid
              ? "Invoice dan instruksi akses akan mengikuti status pembayaran terakhir."
              : "Halaman ini akan menampilkan status terbaru order kamu setelah admin memverifikasi bukti transfer."}
          </p>
        </div>
      </div>

      {showManualPanel && (
        <ManualPaymentPanel
          buktiPath={payment.bukti_path}
          orderId={id}
          rekening={{
            atasNama: paymentConfig.bankAccountName,
            bank: paymentConfig.bankName,
            nomor: paymentConfig.bankAccountNumber,
            qris: paymentConfig.qrisImage,
          }}
        />
      )}

      <Card className="border-border/50 text-left">
        <CardContent className="pt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Detail Pesanan
          </p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono text-xs">{id}</span>
            <span className="text-muted-foreground">Status</span>
            <div className="w-fit">
              <PaymentStatusBadge status={status} showLabel />
            </div>
            <span className="text-muted-foreground">Plan</span>
            <span>{payment ? planLabels[payment.plan] : "Sedang diproses"}</span>
            <span className="text-muted-foreground">Provider</span>
            <span>{payment?.provider ?? "-"}</span>
            <span className="text-muted-foreground">Akses</span>
            <span>{isPaid ? "Aktif sesuai plan" : "Menunggu konfirmasi"}</span>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4 text-left">
        <h2 className="text-lg font-semibold text-center">Langkah selanjutnya</h2>
        <div className="space-y-3">
          {nextSteps.map((step) => (
            <div
              key={step.title}
              className="flex items-start gap-4 rounded-lg border p-4 hover:border-primary/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <step.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0" asChild>
                <Link href={step.href}>
                  {step.cta} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>Ada pertanyaan? Hubungi kami di Discord atau</p>
        <Link href="/contact" className="text-primary underline underline-offset-4">
          kirim pesan lewat halaman kontak
        </Link>
      </div>
    </div>
    </>
  );
}
