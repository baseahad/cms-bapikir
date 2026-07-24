"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { AIProvider } from "@/lib/ai/provider";

export function useAIChat(provider?: AIProvider) {
  return useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: { provider },
    }),
  });
}
