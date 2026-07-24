import { Badge } from "@/components/ui/badge";

const steps = [
  { day: "Hari 1", title: "Clone & Deploy", desc: "Landing page live di Vercel. Supabase dan auth sudah jalan.", active: true },
  { day: "Hari 2–3", title: "Build Fitur", desc: "Fokus bikin fitur utama produk kamu. Boilerplate udah out of the way.", active: false },
  { day: "Hari 4–5", title: "Setup Payment", desc: "Rekening transfer manual siap terima pembayaran dari customer pertama.", active: false },
  { day: "Hari 6", title: "Testing & Polish", desc: "QA, perbaikan kecil, dan final polish sebelum launch.", active: false },
  { day: "Hari 7", title: "Launch! 🚀", desc: "Produk live dan siap dapat customer. Beneran.", active: false },
];

export function TimelineSection() {
  return (
    <section className="marketing-section marketing-section--muted px-4">
      <div className="marketing-section__inner max-w-2xl">
        <div className="marketing-section__header mb-12 space-y-3">
          <Badge variant="secondary" className="marketing-eyebrow">
            Timeline Realistis
          </Badge>
          <h2 className="marketing-heading">
            Dari nol sampai launch dalam 7 hari.
          </h2>
          <p className="marketing-copy text-lg">
            Kamu fokus bikin produk. Boilerplate ngurus yang boring.
          </p>
        </div>

        <div className="marketing-timeline p-6 sm:p-8">
          {steps.map((step, i) => (
            <div key={step.day} className="marketing-timeline__item flex gap-4">
              {/* Dot + line column */}
              <div className="flex flex-col items-center flex-shrink-0 w-8">
                <div
                  className={`marketing-timeline__dot w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 z-10 ${
                    step.active ? "marketing-timeline__dot--active" : ""
                  }`}
                />
                {i < steps.length - 1 && (
                  <div className="marketing-timeline__line w-0.5 flex-1 bg-border my-1" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-8 flex-1 min-w-0 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                <p className="text-xs font-medium text-muted-foreground mb-1">{step.day}</p>
                <p className={`font-semibold text-base ${step.active ? "" : "text-muted-foreground"}`}>
                  {step.title}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="marketing-note mt-8 text-center text-sm italic">
          Intinya: kamu bisa launch minggu ini. Kalau mau.
        </p>
      </div>
    </section>
  );
}
