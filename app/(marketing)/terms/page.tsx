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
          Terakhir diperbarui: 29 Agustus 2026
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
            {siteConfig.name} menyediakan source code aplikasi Next.js beserta dokumentasi dan jendela
            update sesuai tier lisensi yang kamu beli. Layanan ini diberikan
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

        <Section title="3. Pembayaran">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Harga dalam Rupiah (IDR) dan termasuk pajak yang berlaku</li>
            <li>Pembayaran lewat transfer manual ke rekening resmi, diverifikasi admin sebelum license key diterbitkan</li>
            <li>
              Tier sekali-bayar berlaku permanen untuk versi yang tercakup dalam jendela update-nya;
              tier berbasis langganan (mis. Agensi) berlaku selama periode aktif
            </li>
            <li>Tidak ada refund untuk license key yang sudah diterbitkan/diaktifkan kecuali ada kesalahan teknis dari pihak kami</li>
          </ul>
        </Section>

        <Section title="4. Lisensi Perangkat Lunak">
          <p>
            Source code {siteConfig.name} dilisensikan di bawah{" "}
            <strong>Business Source License 1.1 (BSL)</strong> — bukan lisensi open source. Teks
            lengkap dan mengikat ada di file <strong>LICENSE</strong> pada repositori, dengan
            penjelasan sehari-hari di <strong>LICENSING.md</strong>. Ringkasnya:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Kode bersifat source-available: boleh dibaca, diaudit, di-fork, dan dimodifikasi.</li>
            <li>
              Penggunaan non-produksi — pengembangan, pengujian, evaluasi, audit keamanan, dan demo
              di lingkungan non-publik — tidak memerlukan pembayaran.
            </li>
            <li>
              Menjalankan {siteConfig.name} untuk situs atau aplikasi yang diakses publik atau klien
              adalah penggunaan produksi dan memerlukan license key komersial yang sah dari kami,
              sesuai tier yang dibeli.
            </li>
            <li>
              Setiap versi otomatis beralih ke Apache License 2.0 pada Change Date-nya — empat tahun
              setelah versi itu dirilis.
            </li>
            <li>
              Dilarang mendistribusikan ulang atau menjual kembali source code ini, atau mengemasnya
              sebagai produk boilerplate/template milikmu.
            </li>
          </ul>
          <p>
            Jika ada pertentangan antara halaman ini dan file <strong>LICENSE</strong>, yang berlaku
            adalah file <strong>LICENSE</strong>.
          </p>
        </Section>

        <Section title="5. Hak Kekayaan Intelektual">
          <p>
            Merek, nama, logo, dan konten {siteConfig.name} tetap milik kami dan tidak termasuk dalam
            lisensi mana pun di atas, termasuk setelah Change Date. Source code dilisensikan kepadamu
            di bawah BSL 1.1 (lihat bagian 4), bukan dialihkan kepemilikannya. Seluruh library pihak
            ketiga tunduk pada lisensinya masing-masing.
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
