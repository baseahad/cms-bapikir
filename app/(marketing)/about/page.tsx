import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Heart, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Tentang — Avathur Rahman",
  description:
    "C.SBC, CPS, LTCS, NLP, Sujok. Pendiri GINK Digital & MESA by Bapikir. Bantu pengusaha muslim bisnis berkah & punya legacy digital.",
  path: "/about",
});

const certifications = [
  { name: "C.SBC", desc: "Certified Sharia Business Consultant (CORe ISEC, 2024) — \"Dukun Bisnis Syariah\"" },
  { name: "CPS", desc: "Certified Productivity Specialist (Motiva, 2025) — Perfect Week, Managing Daily Flow" },
  { name: "LTCS", desc: "Licensed Trainer Covert Selling (MindTech, 2017)" },
  { name: "CP. NNLP", desc: "Certified Practitioner Neo-NLP (Neo NLP Society, 2020)" },
  { name: "CH, CHt", desc: "Certified Hypnotist & Hypnotherapist (IBH, 2021)" },
  { name: "Sujok", desc: "Sujok Therapist (Sujok Indonesia / PERPASI) — terapi titik tangan & kaki" },
];

const journey = [
  { year: "2014", event: "Lulus Sarjana Hukum Keluarga (S.HI), IAIN Antasari Banjarmasin" },
  { year: "2016", event: "Mendirikan GINK Digital — web, SEO, & konten" },
  { year: "2017", event: "Licensed Trainer Covert Selling (LTCS), Bandung" },
  { year: "2020", event: "Certified Practitioner Neo-NLP (CP. NNLP)" },
  { year: "2021", event: "Certified Hypnotherapist (IBH) + mulai Sujok Therapy & merintis Seahad" },
  { year: "2024", event: "Certified Sharia Business Consultant (C.SBC, CORe ISEC) + mulai ngoding" },
  { year: "2025", event: "Certified Productivity Specialist (CPS, Motiva) + MESA by Bapikir lahir" },
  { year: "2026", event: "Certified Prompt Optimization Specialist (C.PS, AFP) + CMS Bapikir" },
];

const values = [
  {
    icon: BookOpen,
    title: "Syakhshiyah Islamiyah",
    desc: "Semua yang saya kerjakan bermuara pada pembentukan kepribadian Islam — aqliyah & nafsiyah yang seimbang.",
  },
  {
    icon: Brain,
    title: "Berpikir Jernih",
    desc: "Metode rasional At-Tafkir sebagai engine. Bukan ikut-ikutan tren, tapi paham sebab-akibat.",
  },
  {
    icon: Users,
    title: "Keluarga First",
    desc: "Produktivitas bukan buat kerja 24/7. Tapi buat punya waktu lebih buat keluarga.",
  },
  {
    icon: Heart,
    title: "Dakwah Bil Hal",
    desc: "Berdakwah lewat karya nyata — web, konten, AI — yang langsung dirasakan manfaatnya.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <Badge variant="outline">Tentang Saya</Badge>
        <div className="flex items-start gap-6">
          <Image
            src="/avathur-akbs.jpeg"
            alt="Avathur Rahman"
            width={140}
            height={140}
            className="rounded-full border-4 border-border/50 shrink-0"
          />
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              Avathur Rahman — Reformer Cara Berpikir
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Sharia Business Architect &middot; &ldquo;Dukun Bisnis Syariah&rdquo;
              &middot; Sampit, Kalimantan Tengah.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Profil */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Profil</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
          <p>
            Nama asli saya SJ.T. Muhammad Fathur Rahman, S.HI, C.SBC, CPS, LTCS
            &mdash; tapi orang lebih mengenal saya sebagai Avathur Rahman, sang
            &ldquo;Dukun Bisnis Syariah.&rdquo; Saya seorang Sharia Business
            Architect, dan satu prinsip yang saya pegang: jika masalahnya sistem,
            maka solusinya juga sistem.
          </p>
          <p>
            Berbasis di Sampit, Kalimantan Tengah, saya menempuh pendidikan
            Sarjana Hukum Keluarga di IAIN Antasari Banjarmasin, lalu memperdalam
            keahlian lewat sertifikasi Certified Sharia Business Consultant (CORe
            ISEC), Covert Selling (LTCS), Productivity Specialist (Motiva), serta
            Hypnotherapy, NLP, dan terapi Sujok.
          </p>
          <p>
            Sebagai Founder GINK Digital, saya mendampingi pengusaha Muslim
            membangun kehadiran digital lewat website, SEO, dan copywriting
            &mdash; dengan misi &ldquo;meningkatkan taraf berpikir pengusaha
            Muslim dalam mencetak profit berlimpah berkah.&rdquo; Saya penggagas
            Tibyan Copywriting &mdash; &ldquo;Writing That Awakens, Not
            Persuades&rdquo; &mdash; pendekatan menulis berakar epistemologi
            Islam, sekaligus praktisi pengobatan melalui Griya Terapi Seahad. Di
            komunitas, saya menginisiasi NGOBISS (Ngopi Bisnis Syariah) di Sampit,
            ruang belajar fiqh muamalah aplikatif bagi pelaku usaha.
          </p>
        </div>
      </div>

      <Separator />

      {/* Values */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Apa yang Saya Perjuangkan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <Card key={v.title} className="border-border/50">
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-2">
                  <v.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-sm">{v.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Sertifikasi */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Sertifikasi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((c) => (
            <div
              key={c.name}
              className="rounded-lg border bg-muted/30 p-3 space-y-1"
            >
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Journey */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Perjalanan</h2>
        <div className="space-y-4">
          {journey.map((j) => (
            <div key={j.year} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="w-px flex-1 bg-border min-h-[2rem]" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-1">
                  {j.year}
                </Badge>
                <p className="text-sm text-muted-foreground">{j.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Mau Ngobrol?</h2>
        <p className="text-muted-foreground text-sm">
          Konsultasi gratis 15 menit. Diskusi tentang web, AI, produktivitas,
          atau apapun.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Hubungi Saya
        </Link>
      </div>
    </div>
  );
}
