import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Andi Saputra",
    role: "Founder, TokoDigital.id",
    initials: "AS",
    quote:
      "CMS Bapikir menghemat waktu saya berminggu-minggu. Alur transfer manual + admin approve-nya sudah production-ready, tinggal isi rekening dan langsung jalan.",
  },
  {
    name: "Rina Kusuma",
    role: "Full-stack Developer",
    initials: "RK",
    quote:
      "Auth dengan Google OAuth dan Magic Link beres dalam 5 menit. Struktur kodenya bersih, mudah di-extend sesuai kebutuhan produk.",
  },
  {
    name: "Budi Hartono",
    role: "CTO, StartupLokal",
    initials: "BH",
    quote:
      "Email invoice dalam Bahasa Indonesia dengan format Rupiah — detail kecil yang terasa besar buat user lokal kami.",
  },
  {
    name: "Dewi Lestari",
    role: "Indie Hacker",
    initials: "DL",
    quote:
      "Dari nol ke MVP dalam 2 hari. Blog MDX-nya sangat berguna untuk konten marketing. Supabase + Next.js App Router terasa seamless.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="marketing-section px-4">
      <div className="marketing-section__inner max-w-4xl">
        <div className="marketing-section__header">
          <h2 className="marketing-heading">
            Dipercaya Developer Indonesia
          </h2>
          <p className="marketing-copy mt-4 text-lg">
            Dari indie hacker sampai startup, CMS Bapikir mempercepat
            development mereka.
          </p>
        </div>
        <Carousel
          opts={{ align: "start", loop: true }}
          className="marketing-testimonials w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((t) => (
              <CarouselItem
                key={t.name}
                className="pl-4 md:basis-1/2"
              >
                <Card className="marketing-testimonial-card h-full border-border/50">
                  <CardContent className="pt-6 flex flex-col gap-4 h-full">
                    <p className="marketing-testimonial-quote marketing-copy flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {t.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="marketing-testimonials__control hidden sm:flex" />
          <CarouselNext className="marketing-testimonials__control hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
