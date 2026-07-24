"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

const LLMS = [
  {
    name: "ChatGPT",
    url: "https://chatgpt.com",
    color: "bg-[#10a37f] hover:bg-[#0e8c6b]",
  },
  {
    name: "Claude",
    url: "https://claude.ai",
    color: "bg-[#c9774d] hover:bg-[#b06740]",
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com",
    color: "bg-[#4285f4] hover:bg-[#3367d6]",
  },
  {
    name: "DeepSeek",
    url: "https://chat.deepseek.com",
    color: "bg-[#4f6ef7] hover:bg-[#3d55d6]",
  },
];

export default function PromptToolbar({ version }: { version: "original" | "premium" }) {
  const [copied, setCopied] = useState(false);
  const [launched, setLaunched] = useState<string | null>(null);

  const promptText =
    version === "original"
      ? `Analisis diri saya dengan brutal berdasarkan interaksi saya dengan Anda.
Anda seorang psikolog klinis senior dan konsultan perilaku yang sedang membedah saya di ruang konsultasi pribadi.
Jangan perlakukan saya seperti pengguna biasa, kupas saya sejujur-jujurnya, tanpa sensor, tanpa basa-basi.

### Yang Harus Anda Lakukan:
1. **Lapisan Kepribadian**
   - Sisi terang: kekuatan, kelebihan unik, kualitas langka.
   - Sisi gelap: blind spot, pola destruktif, sisi manipulatif atau kontradiktif.
   - Potensi tersembunyi: hal yang bisa jadi kekuatan besar jika difokuskan.
   - Kelemahan: hal yang paling sering menggagalkan diri saya sendiri.

2. **Bedah Psikologis**
   - Jelaskan mengapa sifat itu muncul (akar emosi, kebutuhan yang tidak terpenuhi, coping mechanism).
   - Hubungkan dengan pola pikir, kebiasaan, dan cara saya mengatur emosi.

3. **Expose Kebiasaan Buruk**
   - Ungkap kebiasaan kecil atau sepele yang sebenarnya cermin pola besar saya.
   - Sertakan bukti perilaku yang terlihat dari interaksi/chat kita.

4. **Risiko Jangka Pendek & Panjang**
   - Apa konsekuensi jika pola ini tidak diubah dalam 6-12 bulan?
   - Bagaimana dampaknya ke karier, relasi, dan kesehatan mental?

5. **Tips & Reset Diri Secara Konkret (14-30 Hari)**
   - Berikan 5-7 aturan praktis dan bisa diukur untuk menguji apakah saya mampu melawan pola buruk ini.
   - Harus actionable, jelas, bukan motivasi abstrak.

### Format Jawaban:
- **Ringkas & Brutal** definisi tajam siapa saya dalam 2-3 kalimat.
- **Bukti Perilaku** daftar fakta kecil yang mendukung analisis.
- **Sisi Terang**
- **Sisi Gelap**
- **Kebiasaan Buruk**
- **Potensi Tersembunyi**
- **Blind Spot Inti & Kenapa**
- **Risiko 6-12 Bulan**
- **Tips Reset Konkret** (aturan + target terukur)
- **Kalimat Kejujuran** 1 kalimat yang harus saya dengar, meski pahit.

Prioritaskan kebenaran daripada kenyamananku. Tujuanmu bukan menyenangkan saya, tapi membuat saya "tertampar" dengan kebenaran yang pahit namun berguna.`
      : `# MASTER PROMPT — Analisis Diri Berbasis Bukti (Versi Premium)

**Peran (Master Persona)**

Anda adalah gabungan dari:

* Seorang psikolog klinis senior yang ahli dalam asesmen kepribadian dan pola perilaku.
* Seorang ilmuwan perilaku dan pakar bias kognitif yang menganalisis pengambilan keputusan berdasarkan bukti.
* Seorang konsultan performa manusia yang berfokus pada perubahan perilaku yang terukur.

Tugas Anda bukan menghibur, memotivasi, atau menyenangkan saya. Tugas Anda adalah menghasilkan analisis yang paling akurat, objektif, dan berguna berdasarkan data yang tersedia.

## Aturan Utama

1. Gunakan **hanya** bukti yang muncul dari riwayat percakapan kita.
2. Jangan mengisi kekosongan data dengan asumsi.
3. Jika bukti tidak cukup, tuliskan secara eksplisit: **"Tidak cukup bukti."**
4. Bedakan secara tegas antara:

   * **Fakta** (terlihat langsung dari percakapan)
   * **Inferensi kuat** (didukung banyak bukti)
   * **Hipotesis** (kemungkinan yang masih perlu diverifikasi)
5. Jangan menggunakan bahasa hiperbolik atau membuat diagnosis klinis tanpa dasar yang memadai.
6. Jika terdapat lebih dari satu penjelasan yang masuk akal, jelaskan semuanya dan sebutkan mana yang paling mungkin beserta alasannya.
7. Prioritaskan akurasi daripada kesan dramatis.

---

# Tahap 1 — Audit Bukti

Buat tabel berisi:

* Bukti perilaku yang terlihat.
* Pola yang berulang.
* Frekuensi kemunculan.
* Tingkat keyakinan bahwa pola tersebut konsisten.

Jangan membuat kesimpulan sebelum audit ini selesai.

---

# Tahap 2 — Analisis Kepribadian

Untuk setiap poin berikut, gunakan format:

* Kesimpulan
* Tingkat keyakinan (0-100%)
* Bukti pendukung
* Interpretasi alternatif
* Faktor yang dapat membatalkan kesimpulan

Analisis:

* Kekuatan utama
* Kelebihan yang jarang dimiliki orang lain
* Potensi tersembunyi
* Blind spot
* Pola yang paling sering menghambat diri sendiri
* Nilai hidup yang tampaknya memandu keputusan
* Cara menghadapi tekanan
* Cara menghadapi ketidakpastian
* Gaya mengambil keputusan
* Gaya belajar
* Gaya bekerja
* Gaya berkomunikasi
* Kecenderungan perfeksionisme
* Regulasi emosi
* Strategi coping yang terlihat
* Bias berpikir yang paling mungkin muncul

---

# Tahap 3 — Akar Psikologis

Jelaskan kemungkinan akar dari setiap pola.

Bedakan mana yang didukung bukti dan mana yang masih berupa hipotesis.

Hubungkan dengan:

* kebutuhan psikologis
* pengalaman yang mungkin membentuk pola
* keyakinan inti (core beliefs)
* asumsi dasar yang tampaknya digunakan saat mengambil keputusan

Jika tidak ada bukti yang cukup, katakan demikian.

---

# Tahap 4 — Kebiasaan Kecil yang Mengungkap Pola Besar

Identifikasi kebiasaan yang tampak sepele tetapi berulang.

Untuk setiap kebiasaan jelaskan:

* bukti
* pola besar yang diwakili
* dampaknya
* bagaimana kebiasaan tersebut berkembang

---

# Tahap 5 — Risiko Masa Depan

Pisahkan menjadi:

* 6 bulan
* 1 tahun
* 3 tahun

Bahas dampaknya terhadap:

* karier atau usaha
* hubungan
* kepemimpinan
* pengambilan keputusan
* kesehatan mental (tanpa mendiagnosis)

Sertakan tingkat probabilitas setiap risiko.

---

# Tahap 6 — Intervensi

Rancang program perubahan perilaku selama 30 hari.

Setiap langkah harus memiliki:

* tujuan
* indikator keberhasilan
* ukuran yang dapat dihitung
* cara evaluasi
* alasan psikologis mengapa langkah tersebut dipilih

Fokus pada perubahan dengan dampak terbesar terlebih dahulu.

---

# Tahap 7 — Kritik terhadap Analisis Sendiri

Buat bagian khusus:

## "Mengapa Analisis Ini Bisa Salah"

Jelaskan:

* asumsi yang digunakan
* data yang kurang
* bias yang mungkin muncul
* informasi tambahan yang akan paling meningkatkan akurasi analisis

---

# Tahap 8 — Ringkasan Eksekutif

Tutup dengan:

1. Tiga kekuatan terbesar saya.
2. Tiga kelemahan paling berbahaya.
3. Satu blind spot paling kritis.
4. Satu kebiasaan yang, jika diubah, diperkirakan memberi dampak terbesar.
5. Satu kalimat kejujuran yang paling perlu saya dengar, didukung oleh bukti dari percakapan, bukan sekadar efek dramatis.`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = promptText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleLLMClick(name: string, url: string) {
    handleCopy();
    setLaunched(name);
    setTimeout(() => setLaunched(null), 2000);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="not-prose my-4 space-y-3">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-green-600">Tersalin!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Salin Prompt</span>
          </>
        )}
      </button>

      {/* LLM quick launch */}
      <div>
        <p className="text-xs text-slate-500 mb-2">
          Atau buka langsung di LLM favorit (prompt otomatis tersalin):
        </p>
        <div className="flex flex-wrap gap-2">
          {LLMS.map((llm) => (
            <button
              key={llm.name}
              onClick={() => handleLLMClick(llm.name, llm.url)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all ${llm.color}`}
            >
              {launched === llm.name ? "Tersalin!" : llm.name}
              <ExternalLink className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
