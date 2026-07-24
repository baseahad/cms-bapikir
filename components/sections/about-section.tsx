import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const highlights = [
  {
    label: "Spesialisasi",
    value: "Konsultan Bisnis Syariah",
    desc: "\"Dukun Bisnis Syariah\" — bikin bisnis berkah & terkelola",
  },
  {
    label: "Metodologi",
    value: "Tibyan Copywriting",
    desc: "\"Writing That Awakens, Not Persuades\" — berbasis epistemologi Islam",
  },
  {
    label: "Tools",
    value: "Next.js, AI, Claude Code",
    desc: "Full-stack + AI agent development",
  },
];

export function AboutSection() {
  return (
    <section id="tentang" className="marketing-section marketing-section--muted px-4">
      <div className="marketing-section__inner max-w-4xl">
        <div className="marketing-section__header">
          <h2 className="marketing-heading">Tentang Saya</h2>
        </div>
        <Separator className="mb-10" />
        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <Badge variant="secondary" className="mb-2">
                {item.label}
              </Badge>
              <p className="font-semibold text-sm">{item.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <Separator className="my-10" />
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p>
            Saya percaya setiap orang punya potensi untuk berpikir jernih, produktif,
            dan meninggalkan warisan bermakna. Sebagai Konsultan Bisnis Syariah
            (atau yang lebih dikenal sebagai &ldquo;Dukun Bisnis Syariah&rdquo;), saya bantu
            pengusaha muslim membangun bisnis yang berkah, terkelola, dan
            didukung teknologi AI — dari web development sampai AI pribadi.
          </p>
          <p className="mt-4">
            GINK Digital adalah toolset saya untuk mewujudkan itu — lewat web,
            konten, dan teknologi AI yang personal.
          </p>
        </div>
      </div>
    </section>
  );
}
