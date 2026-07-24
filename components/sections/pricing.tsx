"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    price: 299000,
    earlyBird: 239000,
    description: "Untuk mulai ship lebih cepat.",
    badge: null,
    cta: "Dapatkan Basic",
    ctaHref: "/auth/sign-up",
    variant: "outline" as const,
    features: [
      "Next.js 16 boilerplate lengkap",
      "Supabase Auth (email, Google, Magic Link)",
      "Checkout transfer manual (MALIYA CENTER)",
      "1 email provider (Resend)",
      "30+ UI components (shadcn/ui)",
      "MDX blog system + SEO ready",
      "Dokumentasi Bahasa Indonesia",
      "Discord community + lifetime updates",
    ],
  },
  {
    name: "Pro",
    price: 799000,
    earlyBird: 639000,
    description: "Untuk produk yang serius.",
    badge: "Paling Worth It ⭐",
    cta: "Dapatkan Pro",
    ctaHref: "/auth/sign-up",
    variant: "default" as const,
    features: [
      "Semua di Basic, plus:",
      "Admin dashboard approve/reject transfer manual",
      "Semua email provider",
      "44 UI components lengkap",
      "Admin dashboard template",
      "Unlimited client projects",
      "Priority support",
      "1× konsultasi 30 menit",
    ],
  },
  {
    name: "Ultimate",
    price: 2999000,
    earlyBird: 2399000,
    description: "Untuk yang mau ship dan belajar sekaligus.",
    badge: null,
    cta: "Dapatkan Ultimate",
    ctaHref: "/auth/sign-up",
    variant: "outline" as const,
    features: [
      "Semua di Pro, plus:",
      "Bootcamp Vibe Coding (4 sesi)",
      "Ebook Vibe Coding + lifetime update",
      "4 studi kasus step-by-step",
      "15 template di JualanKoding.com",
      "Akses belajar 12 bulan BelajarKoding.com",
      "Akses selamanya group Discord",
      "2× konsultasi 1-1 (30 menit)",
    ],
  },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PricingSection() {
  const [isEarlyBird, setIsEarlyBird] = useState(false);

  return (
    <section
      id="pricing"
      className="marketing-section marketing-section--muted px-4"
    >
      <div className="marketing-section__inner max-w-5xl">
        <div className="marketing-section__header mb-10 space-y-3">
          <Badge variant="secondary" className="marketing-eyebrow">
            Harga
          </Badge>
          <h2 className="marketing-heading">
            Investasi sekali, ship selamanya.
          </h2>
          <p className="marketing-copy text-lg">
            Bayar satu kali, pakai untuk semua proyek. No subscription.
          </p>
          <div className="marketing-pricing-toggle mt-6 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-3">
            <Label htmlFor="billing-toggle" className="text-sm">
              Harga Normal
            </Label>
            <Switch
              id="billing-toggle"
              checked={isEarlyBird}
              onCheckedChange={setIsEarlyBird}
            />
            <Label htmlFor="billing-toggle" className="text-sm">
              Early Bird{" "}
              <span className="text-primary font-medium">(hemat 20%)</span>
            </Label>
          </div>
        </div>

        <div className="marketing-pricing-grid grid-cols-1 sm:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "marketing-pricing-card border-border/50",
                plan.badge && "marketing-pricing-card--featured border-primary shadow-lg relative",
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <Badge>{plan.badge}</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-2 space-y-0.5">
                  <div className="text-3xl font-bold">
                    {formatRupiah(isEarlyBird ? plan.earlyBird : plan.price)}
                  </div>
                  {isEarlyBird && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatRupiah(plan.price)}
                    </p>
                  )}
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.variant} asChild>
                  <Link href={plan.ctaHref}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="marketing-note mt-8 text-center text-sm">
          Semua harga dalam Rupiah (IDR). Beli sekali, pakai selamanya.
        </p>
      </div>
    </section>
  );
}
