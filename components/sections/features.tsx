import {
  ShieldCheck,
  CreditCard,
  Mail,
  BookOpen,
  LayoutDashboard,
  Moon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: ShieldCheck,
    title: "Auth Lengkap",
    description:
      "Email/password, Google OAuth, Magic Link. Session cookie-based dengan Supabase SSR — aman dan production-ready.",
  },
  {
    icon: CreditCard,
    title: "Pembayaran Lokal",
    description:
      "Transfer manual + upload bukti + admin approve (MALIYA CENTER) sudah terintegrasi — bebas fee-persentase gateway pihak ketiga. Fondasi subscription siap pakai untuk flow billing awal.",
  },
  {
    icon: Mail,
    title: "Email Transaksional",
    description:
      "Template React Email dalam Bahasa Indonesia — welcome email dan invoice. Dikirim via Resend.",
  },
  {
    icon: BookOpen,
    title: "Blog MDX",
    description:
      "Tulis artikel dalam MDX dengan frontmatter, reading time, dan tag support. SEO-friendly out of the box.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    description:
      "Pantau pembayaran, statistik subscription, dan data user. Dilindungi whitelist email admin.",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description:
      "Light, dark, dan system mode. Ditenagai next-themes dan Tailwind CSS variable yang konsisten.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="marketing-section px-4">
      <div className="marketing-section__inner max-w-5xl">
        <div className="marketing-section__header">
          <h2 className="marketing-heading">
            Semua yang kamu butuhkan
          </h2>
          <p className="marketing-copy mt-4 text-lg max-w-xl mx-auto">
            44 komponen UI dan integrasi backend siap pakai — tidak perlu mulai
            dari nol.
          </p>
        </div>
        <Separator className="mb-12" />
        <div className="marketing-card-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="marketing-feature-card border-border/50">
              <CardHeader className="pb-3">
                <div className="marketing-feature-icon mb-2">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="marketing-copy text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
