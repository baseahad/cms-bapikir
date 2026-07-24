import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: `Syarat dan Ketentuan — ${siteConfig.name}`,
  description: `Syarat dan ketentuan penggunaan ${siteConfig.shortName}.`,
  path: "/terms",
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Syarat &amp; Ketentuan</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Terakhir diperbarui: 10 Juli 2026
        </p>
      </div>

      <Separator />

      <p className="text-sm text-muted-foreground leading-relaxed">
        Dengan menggunakan layanan {siteConfig.name}, kamu menyetujui syarat dan ketentuan berikut.
        Baca dengan saksama sebelum melanjutkan.
      </p>

      <div className="space-y-8">
        <Section title="1. Layanan">
          <p>
            {siteConfig.name} menyediakan boilerplate Next.js beserta akses dashboard, dokumentasi,
            dan update yang termasuk dalam paket yang kamu pilih. Layanan ini diberikan
            &quot;sebagaimana adanya&quot; dan dapat berubah sewaktu-waktu dengan pemberitahuan.
          </p>
        </Section>

        <Section title="2. Akun Pengguna">
          <p>
            Kamu bertanggung jawab untuk menjaga kerahasiaan kredensial akun. Satu akun hanya boleh
            digunakan oleh satu orang. Dilarang berbagi akun atau membuat akun ganda untuk
            menghindari batasan layanan.
          </p>
        </Section>

        <Section title="3. Pembayaran dan Subscription">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Harga dalam Rupiah (IDR) dan termasuk PPN jika berlaku</li>
            <li>Pembayaran lewat transfer manual ke rekening resmi, diverifikasi admin sebelum akses aktif</li>
            <li>Subscription berlaku selama periode yang dipilih (bulanan/tahunan)</li>
            <li>Tidak ada refund untuk periode yang sudah berjalan kecuali ada kesalahan teknis dari pihak kami</li>
          </ul>
        </Section>

        <Section title="4. Lisensi Penggunaan">
          <p>
            Dengan berlangganan, kamu mendapatkan lisensi non-eksklusif untuk menggunakan source code
            {siteConfig.name} dalam proyek pribadi dan komersial. Kamu boleh:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Menggunakan boilerplate untuk jumlah proyek sesuai paket kamu</li>
            <li>Memodifikasi dan menyesuaikan kode sesuai kebutuhan</li>
            <li>Menggunakan dalam proyek klien (untuk paket yang mengizinkan)</li>
          </ul>
          <p>Kamu tidak boleh:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Mendistribusikan ulang atau menjual kembali source code</li>
            <li>Mengklaim sebagai karya original kamu untuk dijual sebagai boilerplate</li>
          </ul>
        </Section>

        <Section title="5. Hak Kekayaan Intelektual">
          <p>
            Brand, logo, dan konten {siteConfig.name} adalah milik kami. Source code boilerplate
            dilisensikan kepada kamu, bukan dijual. Semua library pihak ketiga tunduk pada lisensi
            masing-masing.
          </p>
        </Section>

        <Section title="6. Batasan Tanggung Jawab">
          <p>
            {siteConfig.name} tidak bertanggung jawab atas kerugian bisnis, kehilangan data, atau
            kerusakan tidak langsung yang timbul dari penggunaan layanan. Tanggung jawab maksimal
            kami terbatas pada jumlah yang kamu bayarkan dalam 30 hari terakhir.
          </p>
        </Section>

        <Section title="7. Penghentian Layanan">
          <p>
            Kami berhak menangguhkan atau menghentikan akun yang melanggar syarat ini tanpa
            pemberitahuan sebelumnya. Kamu dapat menghapus akun kapan saja melalui halaman Pengaturan.
          </p>
        </Section>

        <Section title="8. Hukum yang Berlaku">
          <p>
            Syarat ini tunduk pada hukum Republik Indonesia. Sengketa akan diselesaikan melalui
            jalur musyawarah atau pengadilan yang berwenang di Indonesia.
          </p>
        </Section>

        <Section title="9. Perubahan Syarat">
          <p>
            Kami dapat memperbarui syarat ini sewaktu-waktu. Perubahan signifikan akan diinformasikan
            melalui email atau notifikasi di dashboard minimal 14 hari sebelum berlaku.
          </p>
        </Section>

        <Section title="10. Kontak">
          <p>
            Ada pertanyaan? Hubungi kami di halaman{" "}
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
