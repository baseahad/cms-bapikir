import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { getModel, type AIProvider } from "@/lib/ai/provider";
import { authorizeAIRequest } from "@/lib/ai/middleware";
import { trackUsage } from "@/lib/ai/usage";
import { resolveAIProvider } from "@/lib/config/features";
import {
  applyRateLimitHeaders,
  createRateLimitResponse,
  getAiRateLimitConfig,
  takeRateLimit,
} from "@/lib/rate-limit";
import { aiChatRequestSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const parsed = aiChatRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Missing required field: messages" },
      { status: 400 }
    );
  }
  const messages = parsed.data.messages as unknown as UIMessage[];
  const provider = parsed.data.provider as AIProvider | undefined;

  const selectedProvider = provider ?? resolveAIProvider();
  const auth = await authorizeAIRequest(selectedProvider);
  if (auth instanceof Response) return auth;
  const rateLimit = await takeRateLimit(getAiRateLimitConfig(auth.userId, auth.plan));

  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit, "Terlalu banyak request AI. Coba lagi sebentar.");
  }

  const model = getModel(selectedProvider);

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
    onFinish: async ({ usage }) => {
      await trackUsage(
        auth.userId,
        selectedProvider,
        model.modelId,
        usage.inputTokens ?? 0,
        usage.outputTokens ?? 0
      );
    },
  });

  return applyRateLimitHeaders(result.toUIMessageStreamResponse(), rateLimit);
}
