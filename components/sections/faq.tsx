import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqs = [
  {
    q: "Apakah ini one-time purchase atau subscription?",
    a: "One-time purchase. Kamu bayar sekali dan mendapatkan seluruh source code, dokumentasi, dan semua update selamanya. Tidak ada biaya bulanan.",
  },
  {
    q: "Berapa proyek yang bisa dibuat dengan satu lisensi?",
    a: "Paket Basic untuk 1 proyek pribadi. Paket Pro ke atas bisa dipakai untuk unlimited proyek termasuk proyek klien komersial.",
  },
  {
    q: "Apa bedanya CMS Bapikir dengan template biasa?",
    a: "CMS Bapikir bukan sekadar template visual. Ini adalah production-ready boilerplate dengan auth, alur pembayaran transfer manual, email transaksional, database schema, dan dokumentasi lengkap — siap dipakai langsung tanpa konfigurasi berhari-hari.",
  },
  {
    q: "Payment gateway apa yang didukung?",
    a: "Tidak ada gateway pihak ketiga (Midtrans/Doku dkk) — sesuai kebijakan MALIYA CENTER, sengaja lepas dari gateway fee-persentase. Alurnya: transfer manual ke rekening/QRIS, user upload bukti, admin approve lewat dashboard, subscription aktif otomatis.",
  },
  {
    q: "Supabase project saya harus di-setup sendiri?",
    a: "Ya. Kamu perlu membuat Supabase project, menjalankan migration SQL yang sudah tersedia, dan mengisi environment variables. Proses ini biasanya kurang dari 15 menit.",
  },
  {
    q: "Tech stack apa yang digunakan?",
    a: "Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase SSR, Resend, dan React Email. Semua dependensi stabil dan production-ready.",
  },
];

export function FaqSection() {
  return (
    <section className="marketing-section px-4">
      <div className="marketing-section__inner max-w-2xl">
        <div className="marketing-section__header">
          <h2 className="marketing-heading">
            Pertanyaan Umum
          </h2>
        </div>
        <Accordion type="single" collapsible className="marketing-faq w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
