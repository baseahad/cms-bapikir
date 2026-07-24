import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Headline — pintu masuk, biar orang gak defensif */}
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Avathur Rahman
          </h1>
          <p className="mt-4 text-2xl text-muted-foreground md:text-3xl">
            Dukun Bisnis Syariah
          </p>

          {/* Misi — yang sebenernya, samar-samar dulu */}
          <p className="mt-2 text-sm italic text-muted-foreground/60">
            Reformer Cara Berpikir
          </p>

          {/* Cerita — CV yang menjual, bukan katalog jasa */}
          <div className="prose prose-zinc mx-auto mt-10 max-w-xl text-balance text-left dark:prose-invert">
            <p className="leading-relaxed text-muted-foreground">
              Saya dari Kumai. Gagal sekolah di mata sistem, rugi dua ratus juta
              di usia muda, dan nyaris putus asa. Tapi dari situ saya nemuin
              pola: setiap masalah — keuangan, kesehatan, bisnis — akarnya selalu
              di cara berpikir.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Makanya saya panggil diri saya Dukun. Biar orang datang tanpa
              defensif. Tanpa merasa digurui. Setelah duduk, baru saya kasih
              dalil, data, dan sistem yang ngubah cara mereka memandang masalah.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Sepuluh tahun ngobrol bareng pengusaha Sampit. Dari akad QRIS
              sampai adab bisnis. Yang saya jual bukan jasa — tapi cara berpikir
              yang lebih baik, dengan fondasi Islam.
            </p>
          </div>

          {/* CTA — lembut, bukan jualan */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/tentang">Kenalan Dulu</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/blog">Baca Tulisan Saya</Link>
            </Button>
          </div>

          {/* Footnote — pengalihan gelar */}
          <p className="mt-8 text-xs text-muted-foreground/40">
            Punya beberapa sertifikasi. Tapi gak penting disebut di sini.
          </p>
        </div>
      </div>
    </section>
  );
}
