import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TemplateBanner } from "@/components/ui/template-banner";
import { Check, Lock } from "lucide-react";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Checkout — CMS Bapikir",
  description:
    "Lihat paket dan lanjutkan ke alur pembelian.",
  path: "/checkout",
});

const plans: Record<string, {
  name: string;
  price: number;
  description: string;
  features: string[];
}> = {
  basic: {
    name: "Basic",
    price: 299000,
    description: "Untuk mulai ship lebih cepat.",
    features: [
      "Next.js 16 boilerplate lengkap",
      "Supabase Auth",
      "Checkout transfer manual (MALIYA CENTER)",
      "MDX blog + SEO ready",
      "Discord community + lifetime updates",
    ],
  },
  pro: {
    name: "Pro",
    price: 799000,
    description: "Untuk produk yang serius.",
    features: [
      "Semua di Basic",
      "Admin approve dashboard untuk verifikasi transfer manual",
      "44 UI components",
      "Admin dashboard template",
      "Unlimited client projects",
      "1× konsultasi 30 menit",
    ],
  },
  ultimate: {
    name: "Ultimate",
    price: 2999000,
    description: "Untuk yang mau ship dan belajar sekaligus.",
    features: [
      "Semua di Pro",
      "Bootcamp Vibe Coding (4 sesi)",
      "Ebook Vibe Coding",
      "15 template di JualanKoding.com",
      "2× konsultasi 1-1",
    ],
  },
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planKey = "pro" } = await searchParams;
  const plan = plans[planKey] ?? plans.pro;

  return (
    <>
      <TemplateBanner description="Halaman checkout untuk produkmu — hubungkan ke rekening transfer manual (MALIYA CENTER) dan sesuaikan paket hargamu" />
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-muted-foreground text-sm">Selesaikan pembelian untuk mulai ship lebih cepat.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Ringkasan Pesanan
            </h2>
            <Card className="border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Paket {plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{plan.description}</p>
                  </div>
                  <Badge>Lifetime</Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-3">
                <ul className="space-y-2 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Separator className="mb-4" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-2xl font-bold">{formatRupiah(plan.price)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pembayaran satu kali. Tidak ada biaya tambahan.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 flex-shrink-0" />
            Pembayaran lewat transfer manual. Bukti transfer disimpan di storage privat untuk
            verifikasi admin.
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Pilih paket lain?</p>
            <div className="flex gap-2">
              {Object.entries(plans).map(([key, p]) => (
                <Link
                  key={key}
                  href={`/checkout?plan=${key}`}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    key === planKey
                      ? "border-primary text-primary bg-primary/5"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Cara Pembayaran
          </h2>
          <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
            <p className="text-sm">
              Setelah daftar, kamu akan dapat instruksi rekening/QRIS untuk transfer manual —
              bebas fee-persentase gateway pihak ketiga. Alurnya:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Transfer sesuai nominal ke rekening/QRIS yang ditampilkan</li>
              <li>Upload bukti transfer di halaman order kamu</li>
              <li>Admin verifikasi bukti dan approve</li>
              <li>Plan aktif otomatis setelah disetujui</li>
            </ul>
          </div>

          <Button size="lg" className="w-full" asChild>
            <Link href="/auth/sign-up">
              Daftar & Bayar {formatRupiah(plan.price)}
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Kamu perlu akun untuk melanjutkan pembayaran.{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Sudah punya akun? Masuk.
            </Link>
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2">
            {["Lifetime Access", "Refund Policy", "Discord Support"].map((item) => (
              <div
                key={item}
                className="text-center text-xs text-muted-foreground border rounded p-2"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
