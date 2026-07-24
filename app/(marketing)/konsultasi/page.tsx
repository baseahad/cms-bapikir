import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createMetadata } from "@/lib/seo";
import { Calendar, MessageCircle, Send } from "lucide-react";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Konsultasi — Avathur Rahman",
  description: "Booking konsultasi bisnis syariah, coaching produktivitas, copywriting, atau Sujok therapy.",
  path: "/konsultasi",
});

const services = [
  {
    title: "Konsultasi Bisnis Syariah",
    desc: "Bimbingan 1-on-1 untuk pengusaha muslim. Dari struktur bisnis, pemasaran, sampai digitalisasi.",
    durasi: "60 menit",
  },
  {
    title: "Coaching Produktivitas",
    desc: "Framework CPS: Perfect Week, Managing Daily Flow, tauhid work principle.",
    durasi: "60 menit",
  },
  {
    title: "Tibyan Copywriting",
    desc: "Copywriting yang menjual tanpa kelihatan jualan. Metode KDTBU.",
    durasi: "90 menit",
  },
  {
    title: "Sujok Therapy",
    desc: "Terapi holistik titik tangan & kaki. Bisa offline (Sampit) atau online.",
    durasi: "45-60 menit",
  },
];

export default function KonsultasiPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_HANDLE ?? "";

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <Calendar className="h-8 w-8 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-2">Konsultasi</h1>
        <p className="text-muted-foreground">
          15 menit konsultasi gratis untuk sesi pertama. Diskusi tentang bisnis
          syariah, produktivitas, copywriting, atau apapun.
        </p>
      </div>

      <Separator className="mb-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {services.map((s) => (
          <Card key={s.title} className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{s.desc}</p>
              <p className="text-xs text-primary">Durasi: {s.durasi}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {(whatsapp || telegram) && (
        <div className="text-center space-y-4 p-8 rounded-lg border">
          <p className="text-sm text-muted-foreground">
            Hubungi saya langsung untuk booking:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {whatsapp && (
              <Button asChild>
                <Link href={`https://wa.me/${whatsapp}`} target="_blank">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Link>
              </Button>
            )}
            {telegram && (
              <Button variant="outline" asChild>
                <Link href={`https://t.me/${telegram}`} target="_blank">
                  <Send className="h-4 w-4" />
                  Telegram
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
