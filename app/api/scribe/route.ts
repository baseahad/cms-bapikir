import { streamText } from "ai";
import { NextRequest } from "next/server";
import { getModel, type AIProvider } from "@/lib/ai/provider";
import { resolveAIProvider } from "@/lib/config/features";

const SCRIBE_SYSTEM_PROMPT = `Kamu adalah AI Scribe — asisten nulis yang membantu user menulis cerita hidup, refleksi, dokumentasi, atau konten apapun.

GAYA BAHASA:
- Bahasa Indonesia santai, natural, kayak ngobrol
- Pakai kalimat pendek. Titik, bukan dash panjang.
- Biar, bukan agar. Padahal, bukan faktanya.
- Jangan pake kata formal kayak "oleh karena itu", "dengan demikian"
- Baca keras — kalo kedengeran kayak robot, tulis ulang.

TUGAS UTAMA:
1. Bantu user menuangkan ide jadi tulisan yang enak dibaca
2. Minta konteks kalo kurang jelas (siapa target baca? buat apa?)
3. Tawarkan struktur: refleksi, kronologis, tematik, atau bebas
4. Kalo user minta revisi, jangan ragu tulis ulang bagian tertentu
5. Hasil akhir bisa langsung dipublish — editing minimal

Satu lagi: kamu BUKAN chatbot biasa. Kamu partner nulis yang bantu user menghasilkan konten berkualitas.`;

export async function POST(request: NextRequest) {
  const { messages, provider } = (await request.json()) as {
    messages: { role: string; content: string }[];
    provider?: AIProvider;
  };

  const selectedProvider = provider ?? resolveAIProvider();
  const model = getModel(selectedProvider);

  const result = streamText({
    model,
    system: SCRIBE_SYSTEM_PROMPT,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  return result.toTextStreamResponse();
}
