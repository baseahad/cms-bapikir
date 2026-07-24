// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";

const useChatMock = vi.fn();
const DefaultChatTransportMock = vi.fn(function DefaultChatTransportMock(
  options: Record<string, unknown>
) {
  return { options };
});

vi.mock("@ai-sdk/react", () => ({
  useChat: useChatMock,
}));

vi.mock("ai", () => ({
  DefaultChatTransport: DefaultChatTransportMock,
}));

describe("hooks/use-ai-chat", () => {
  beforeEach(() => {
    useChatMock.mockReset();
    DefaultChatTransportMock.mockClear();
    useChatMock.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
    });
  });

  it("configures the chat transport for the selected provider", async () => {
    const { useAIChat } = await import("@/hooks/use-ai-chat");
    const { result } = renderHook(() => useAIChat("anthropic"));

    expect(DefaultChatTransportMock).toHaveBeenCalledWith({
      api: "/api/ai/chat",
      body: {
        provider: "anthropic",
      },
    });
    expect(useChatMock).toHaveBeenCalledWith({
      transport: {
        options: {
          api: "/api/ai/chat",
          body: {
            provider: "anthropic",
          },
        },
      },
    });
    expect(result.current.messages).toEqual([]);
  });
});
