import Link from "next/link";
import { CurrentYear } from "@/components/layout/current-year";
import { DesignSwitcher } from "@/components/marketing/design-switcher";
import { siteConfig } from "@/config/site";
import { Github, Send } from "lucide-react";

const footerLinks = {
  Konten: [
    { label: "Blog", href: "/blog" },
    { label: "Tulis dengan AI", href: "/tulis" },
    { label: "Tentang Saya", href: "/about" },
    { label: "Kontak", href: "/contact" },
  ],
  Layanan: [
    { label: "GINK Digital", href: "https://ginkdigital.com" },
    { label: "MESA by Bapikir", href: "https://mesa.avathur.id" },
    { label: "Konsultan Bisnis Syariah", href: "/about" },
  ],
  Info: [
    { label: "Status Layanan", href: "/status" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Open Startup", href: "/open" },
  ],
  Legal: [
    { label: "Syarat & Ketentuan", href: "/terms" },
    { label: "Kebijakan Privasi", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="marketing-footer w-full border-t bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <Link href="/" className="marketing-brand font-bold text-base">
              {siteConfig.name}
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reformer Cara Berpikir — bantu pengusaha muslim membangun bisnis
              yang berkah, terkelola, dan punya legacy digital.
            </p>
            <div className="flex gap-3 pt-1">
              <Link
                href={siteConfig.links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/ginkdigital"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide">
                {category}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            &copy; <CurrentYear /> {siteConfig.name}
          </p>
          <DesignSwitcher />
        </div>
      </div>
    </footer>
  );
}
