import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const points = [
  "CLAUDE.md sudah di-setup dengan konteks proyek",
  "Struktur kode bersih dan terorganisir — AI bisa baca dengan mudah",
  "Dokumentasi dalam Bahasa Indonesia untuk konteks lokal",
  "Naming conventions konsisten di seluruh codebase",
  "TypeScript strict mode — AI autocomplete lebih akurat",
  "AGENTS.md untuk panduan coding agents",
];

const tools = ["Claude Code", "GitHub Copilot", "Cursor", "Windsurf"];

export function AiOptimizedSection() {
  return (
    <section className="marketing-section px-4">
      <div className="marketing-section__inner max-w-4xl">
        <div className="marketing-ai-grid grid grid-cols-1 items-center gap-12">
          <div className="space-y-5">
            <Badge variant="outline" className="marketing-eyebrow">
              AI-Friendly Codebase
            </Badge>
            <h2 className="marketing-heading">
              Kompatibel sama Claude Code, Copilot, dan AI tools lainnya.
            </h2>
            <p className="marketing-copy leading-relaxed">
              CMS Bapikir didesain supaya AI bisa bantu kamu coding lebih efektif.
              Codebase yang clean dan terstruktur bikin AI tools bisa ngerti konteks
              dengan benar — jadi saran yang keluar lebih relevan.
            </p>
            <ul className="space-y-2">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="marketing-eyebrow text-muted-foreground">
              Sudah dioptimalkan untuk
            </p>
            <div className="marketing-ai-tools">
              {tools.map((tool) => (
                <div
                  key={tool}
                  className="marketing-ai-tool text-sm"
                >
                  {tool}
                </div>
              ))}
            </div>
            <div className="marketing-ai-note text-sm leading-relaxed">
              <span className="font-mono text-xs block mb-2 text-primary">CLAUDE.md</span>
              CMS Bapikir + Claude Code = development 10× lebih cepat. AI bisa langsung
              ngerti arsitektur, payment flow, dan konvensi kode tanpa penjelasan panjang.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
