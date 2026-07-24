import { Badge } from "@/components/ui/badge";

const stack = [
  { name: "Next.js 16", category: "Framework" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "shadcn/ui", category: "UI" },
  { name: "Supabase", category: "Database & Auth" },
  { name: "Transfer Manual", category: "Payment" },
  { name: "Resend", category: "Email" },
  { name: "Vercel", category: "Hosting" },
  { name: "React Email", category: "Email" },
  { name: "Claude Code", category: "AI" },
  { name: "GitHub Actions", category: "CI/CD" },
];

export function TechStackSection() {
  return (
    <section className="marketing-section marketing-section--muted px-4">
      <div className="marketing-section__inner max-w-4xl text-center">
        <div className="marketing-section__header mb-10 space-y-3">
          <Badge variant="secondary" className="marketing-eyebrow">
            Tech Stack
          </Badge>
          <h2 className="marketing-heading">
            Dibangun pakai teknologi yang udah kamu kenal.
          </h2>
          <p className="marketing-copy text-lg">
            Nggak perlu belajar hal baru. Stack-nya familiar, teruji, dan siap production.
          </p>
        </div>

        <div className="marketing-stack-grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {stack.map((item) => (
            <div
              key={item.name}
              className="marketing-stack-card space-y-1 text-left transition-colors"
            >
              <p className="font-medium text-sm">{item.name}</p>
              <p className="marketing-copy text-xs">{item.category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
