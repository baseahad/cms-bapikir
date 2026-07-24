import { resetRateLimitStore } from "@/lib/rate-limit";

const authorizeAIRequestMock = vi.fn();
const getModelMock = vi.fn();
const trackUsageMock = vi.fn();
const convertToModelMessagesMock = vi.fn();
const streamTextMock = vi.fn();

vi.mock("@/lib/ai/middleware", () => ({
  authorizeAIRequest: authorizeAIRequestMock,
}));

vi.mock("@/lib/ai/provider", () => ({
  getModel: getModelMock,
}));

vi.mock("@/lib/ai/usage", () => ({
  trackUsage: trackUsageMock,
}));

vi.mock("ai", () => ({
  convertToModelMessages: convertToModelMessagesMock,
  streamText: streamTextMock,
}));

describe("app/api/ai/chat/route", () => {
  beforeEach(() => {
    resetRateLimitStore();
    authorizeAIRequestMock.mockReset();
    getModelMock.mockReset();
    trackUsageMock.mockReset();
    convertToModelMessagesMock.mockReset();
    streamTextMock.mockReset();
  });

  afterEach(() => {
    resetRateLimitStore();
  });

  it("returns the authorization response when access is denied", async () => {
    authorizeAIRequestMock.mockResolvedValue(
      new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: {
          "content-type": "application/json",
        },
        status: 401,
      })
    );

    const { POST } = await import("@/app/api/ai/chat/route");
    const response = await POST(
      new Request("http://localhost/api/ai/chat", {
        body: JSON.stringify({
          messages: [],
        }),
        method: "POST",
      }) as never
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Unauthorized",
    });
  });

  it("streams chat completions and tracks usage on finish", async () => {
    const response = new Response("stream");

    authorizeAIRequestMock.mockResolvedValue({
      plan: "PRO",
      userId: "user-1",
    });
    getModelMock.mockReturnValue({
      modelId: "gpt-4o",
    });
    convertToModelMessagesMock.mockResolvedValue([
      {
        content: "Halo",
        role: "user",
      },
    ]);
    streamTextMock.mockImplementation(({ onFinish }: { onFinish: (info: { usage: { inputTokens: number; outputTokens: number } }) => Promise<void> }) => {
      void onFinish({
        usage: {
          inputTokens: 4,
          outputTokens: 8,
        },
      });

      return {
        toUIMessageStreamResponse: () => response,
      };
    });

    const { POST } = await import("@/app/api/ai/chat/route");
    const result = await POST(
      new Request("http://localhost/api/ai/chat", {
        body: JSON.stringify({
          messages: [
            {
              id: "1",
              parts: [{ text: "Halo", type: "text" }],
              role: "user",
            },
          ],
        }),
        method: "POST",
      }) as never
    );

    expect(convertToModelMessagesMock).toHaveBeenCalledWith([
      {
        id: "1",
        parts: [{ text: "Halo", type: "text" }],
        role: "user",
      },
    ]);
    expect(streamTextMock).toHaveBeenCalledWith({
      messages: [
        {
          content: "Halo",
          role: "user",
        },
      ],
      model: {
        modelId: "gpt-4o",
      },
      onFinish: expect.any(Function),
    });
    expect(trackUsageMock).toHaveBeenCalledWith(
      "user-1",
      "openai",
      "gpt-4o",
      4,
      8
    );
    await expect(result.text()).resolves.toBe("stream");
  });
});
