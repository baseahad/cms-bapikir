import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createMetadata } from "@/lib/seo";
import { BookOpen, Heart, Sparkles, Timer } from "lucide-react";

export const metadata = createMetadata({
  title: "Arc Kehidupan — Avathur Rahman",
  description: "Dokumentasi perjalanan hidup: cerita, refleksi, dan kenangan dalam satu timeline.",
  path: "/arc",
});

const sampleArcs = [
  {
    icon: Heart,
    title: "Masa Kecil",
    desc: "Kenangan masa kecil, keluarga, dan lingkungan yang membentuk.",
    year: "1990-an",
  },
  {
    icon: BookOpen,
    title: "Pendidikan",
    desc: "Mondok, kuliah, dan perjalanan mencari ilmu.",
    year: "2000-an",
  },
  {
    icon: Timer,
    title: "Karir & Bisnis",
    desc: "Dari Sujok, NLP, CPS, sampai AI development.",
    year: "2010-an",
  },
  {
    icon: Sparkles,
    title: "Keluarga",
    desc: "Pernikahan, anak, dan dinamika rumah tangga.",
    year: "2015-sekarang",
  },
];

export default function ArcPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <BookOpen className="h-8 w-8 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-2">Arc Kehidupan</h1>
        <p className="text-muted-foreground">
          Dokumentasikan cerita hidupmu dalam timeline. Dari masa kecil sampai
          sekarang — biar gak lupa, dan bisa diwariskan ke anak cucu.
        </p>
      </div>

      <Separator className="mb-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {sampleArcs.map((arc) => (
          <Card key={arc.title} className="border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <arc.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{arc.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-1">
                {arc.desc}
              </p>
              <p className="text-xs text-primary">{arc.year}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center space-y-4 p-8 rounded-lg border border-dashed">
        <p className="text-muted-foreground text-sm">
          Fitur Arc Kehidupan masih dalam pengembangan. Nanti lo bisa:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>✨ Bikin timeline kehidupan sendiri</li>
          <li>📝 Tambah cerita per tahun</li>
          <li>📸 Upload foto dari setiap fase</li>
          <li>🤖 Minta AI Scribe nulisin cerita masa kecil</li>
        </ul>
        <Button variant="outline" disabled>
          Segera Hadir
        </Button>
      </div>
    </main>
  );
}
