import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: `Kebijakan Privasi — ${siteConfig.name}`,
  description: `Kebijakan privasi ${siteConfig.shortName} — bagaimana data dikumpulkan, digunakan, dan dilindungi.`,
  path: "/privacy",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kebijakan Privasi</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Terakhir diperbarui: 10 Juli 2026
        </p>
      </div>

      <Separator />

      <p className="text-sm text-muted-foreground leading-relaxed">
        {siteConfig.name} (&quot;kami&quot;) berkomitmen untuk melindungi privasi kamu. Kebijakan ini
        menjelaskan data apa yang kami kumpulkan, bagaimana kami menggunakannya, dan hak-hak kamu
        sebagai pengguna.
      </p>

      <div className="space-y-8">
        <Section title="1. Data yang Kami Kumpulkan">
          <p>
            Kami mengumpulkan data berikut saat kamu menggunakan layanan kami:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Alamat email dan informasi akun saat kamu mendaftar</li>
            <li>Bukti transfer manual (foto/PDF) yang kamu upload untuk verifikasi pembayaran</li>
            <li>Data penggunaan layanan secara anonim untuk meningkatkan produk</li>
            <li>Log teknis standar seperti alamat IP dan browser untuk keamanan</li>
          </ul>
        </Section>

        <Section title="2. Bagaimana Kami Menggunakan Data">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Menyediakan dan meningkatkan layanan {siteConfig.name}</li>
            <li>Mengirim email transaksional (konfirmasi, invoice) via Resend</li>
            <li>Memproses pembayaran dan memperbarui status subscription</li>
            <li>Menghubungi kamu terkait akun atau perubahan layanan</li>
          </ul>
        </Section>

        <Section title="3. Penyimpanan dan Keamanan Data">
          <p>
            Data akun disimpan di Supabase dengan enkripsi standar industri. Bukti transfer
            disimpan di storage privat dan hanya bisa diakses oleh kamu dan admin untuk keperluan
            verifikasi pembayaran. Kami menggunakan Row Level Security (RLS) untuk memastikan kamu
            hanya bisa mengakses data milik kamu.
          </p>
        </Section>

        <Section title="4. Berbagi Data dengan Pihak Ketiga">
          <p>
            Kami tidak menjual atau menyewakan data kamu. Data hanya dibagikan kepada:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Supabase</strong> — penyedia database dan autentikasi
            </li>
            <li>
              <strong>Resend</strong> — pengiriman email transaksional
            </li>
          </ul>
          <p>Semua penyedia pihak ketiga memiliki kebijakan privasi dan keamanan masing-masing.</p>
        </Section>

        <Section title="5. Hak Kamu">
          <p>Kamu berhak untuk:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Mengakses data pribadi yang kami simpan tentang kamu</li>
            <li>Meminta koreksi data yang tidak akurat</li>
            <li>Menghapus akun dan data kamu</li>
            <li>Menarik persetujuan penggunaan data sewaktu-waktu</li>
          </ul>
          <p>
            Untuk mengajukan permintaan, hubungi kami di halaman{" "}
            <a href="/contact" className="text-primary underline underline-offset-4">
              Kontak
            </a>
            .
          </p>
        </Section>

        <Section title="6. Cookie">
          <p>
            Kami menggunakan cookie sesi untuk menjaga status login kamu melalui Supabase Auth.
            Tidak ada cookie iklan atau pelacakan pihak ketiga yang digunakan.
          </p>
        </Section>

        <Section title="7. Perubahan Kebijakan">
          <p>
            Jika ada perubahan signifikan pada kebijakan ini, kami akan memberikan notifikasi melalui
            email atau pengumuman di dashboard. Penggunaan layanan setelah perubahan berarti kamu
            menyetujui kebijakan yang diperbarui.
          </p>
        </Section>

        <Section title="8. Kontak">
          <p>
            Ada pertanyaan tentang privasi? Hubungi kami melalui halaman{" "}
            <a href="/contact" className="text-primary underline underline-offset-4">
              Kontak
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
