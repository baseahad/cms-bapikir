import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createMetadata } from "@/lib/seo";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import {
  BookOpen,
  Bot,
  Handshake,
  Lightbulb,
  MessageCircle,
  Package,
  PenLine,
  Store,
  UserCheck,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { paymentConfig, isManualPaymentConfigured } from "@/config/payment";
import { getTokoProducts } from "@/lib/data/toko-products";

export const metadata = createMetadata({
  title: `Toko — ${siteConfig.name}`,
  description: "Produk dan jasa yang kami tawarkan.",
  path: "/toko",
});

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "book-open": BookOpen,
  bot: Bot,
  handshake: Handshake,
  lightbulb: Lightbulb,
  "pen-line": PenLine,
  "user-check": UserCheck,
};

export default function TokoPage() {
  const products = getTokoProducts();

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Toko</h1>
        <p className="text-muted-foreground">
          Produk digital & jasa yang saya tawarkan.
        </p>
      </div>

      <Separator className="mb-10" />

      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Store className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Belum ada produk yang ditampilkan.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => {
          const Icon = ICON_MAP[p.icon] ?? Package;
          return (
          <Link key={p.title} href={p.href} className="group">
            <Card className="border-border/50 h-full transition-colors group-hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <Badge variant="secondary" className="text-xs">
                    {p.label}
                  </Badge>
                </div>
                <CardTitle className="text-base">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {p.desc}
                </p>
                {p.price && (
                  <p className="text-sm font-semibold text-primary">{p.price}</p>
                )}
              </CardContent>
            </Card>
          </Link>
          );
        })}
      </div>
      )}

      <Separator className="my-10" />

      <div className="text-center p-8 rounded-lg border">
        <h2 className="text-lg font-semibold mb-3">Cara Pesan</h2>
        <ol className="text-sm text-muted-foreground space-y-2 text-left max-w-sm mx-auto">
          <li>1. Hubungi via WhatsApp atau Telegram</li>
          <li>2. Diskusi kebutuhan & harga</li>
          <li>3. Transfer ke rekening di bawah</li>
          <li>4. Konfirmasi pembayaran</li>
          <li>5. Produk/jasa dikirim</li>
        </ol>

        <Separator className="my-6" />

        {isManualPaymentConfigured() ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-start sm:items-center">

            <div className="inline-block text-left bg-muted/30 rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Transfer ke
              </p>
              <p className="font-mono text-sm">{paymentConfig.bankAccountNumber}</p>
              <p className="text-sm text-muted-foreground">a.n. {paymentConfig.bankAccountName}</p>
              {paymentConfig.bankName && (
                <p className="text-xs text-muted-foreground mt-1">{paymentConfig.bankName}</p>
              )}
            </div>

            {paymentConfig.qrisImage && (
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Atau scan QRIS
                </p>
                <ImageLightbox
                  src={paymentConfig.qrisImage}
                  alt={`QRIS ${siteConfig.name}`}
                  label={paymentConfig.qrisLabel || "Scan untuk bayar"}
                />
                {paymentConfig.qrisLabel && (
                  <p className="text-xs text-muted-foreground mt-1">{paymentConfig.qrisLabel}</p>
                )}
              </div>
            )}

          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Info pembayaran belum diatur. Hubungi kami langsung untuk detail transfer.
          </p>
        )}

        {paymentConfig.whatsapp && (
          <div className="flex gap-3 justify-center mt-6">
            <Button asChild>
              <Link href={`https://wa.me/${paymentConfig.whatsapp}`} target="_blank">
                <MessageCircle className="h-4 w-4" />
                Konfirmasi via WA
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
