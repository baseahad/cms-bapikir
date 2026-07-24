import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Bot, Globe, Handshake, Lightbulb, PenLine, UserCheck } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "GINK Digital",
    description:
      "Web development, SEO, copywriting untuk UMKM dan profesional. Dari landing page sampai platform kompleks.",
    href: "https://ginkdigital.com",
  },
  {
    icon: Handshake,
    title: "Konsultan Bisnis Syariah",
    description:
      "\"Dukun Bisnis Syariah\" — bantu pengusaha muslim bangun bisnis yang berkah, terkelola, dan terdigitalisasi dengan fondasi syariah.",
    href: "/about",
  },
  {
    icon: Bot,
    title: "MESA by Bapikir",
    description:
      "AI pribadi yang live di laptop Anda. Ingat semua tentang Anda — DNA Injection personal AI pertama di Indonesia.",
    href: "/mesa",
  },
  {
    icon: PenLine,
    title: "Tibyan Copywriting",
    description:
      "Metode KDTBU yang lahir dari 10+ tahun praktik — \"Writing That Awakens, Not Persuades\". Bikin konten yang menjual tanpa kelihatan jualan.",
    href: "/blog/tibyan-copywriting",
  },
  {
    icon: Lightbulb,
    title: "Coaching Produktivitas",
    description:
      "CPS Certified Practitioner. Framework Perfect Week + Managing Daily Flow + tauhid work principle.",
    href: "/blog/cps-productivity",
  },
  {
    icon: UserCheck,
    title: "Sujok Therapy",
    description:
      "Terapi titik tangan & kaki. Pendekatan holistik untuk kesehatan fisik dan mental berbasis korelasi organ.",
    href: "/blog/sujok-therapy",
  },
  {
    icon: BookOpen,
    title: "CMS Bapikir",
    description:
      "Platform dokumentasi arc kehidupan + toko digital. Dari parenting sampai legacy digital anak cucu.",
    href: "/blog/cms-bapikir",
  },
];

export function ServicesSection() {
  return (
    <section id="layanan" className="marketing-section px-4">
      <div className="marketing-section__inner max-w-5xl">
        <div className="marketing-section__header">
          <h2 className="marketing-heading">Apa yang Saya Kerjakan</h2>
          <p className="marketing-copy mt-4 text-lg max-w-xl mx-auto">
            6 area layanan yang saling mendukung — semuanya dibangun di atas fondasi
            berpikir jernih dan syariah.
          </p>
        </div>
        <Separator className="mb-12" />
        <div className="marketing-card-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="group">
              <Card className="marketing-feature-card border-border/50 transition-colors h-full group-hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="marketing-feature-icon mb-2">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="marketing-copy text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
