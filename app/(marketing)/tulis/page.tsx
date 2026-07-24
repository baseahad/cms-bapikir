"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createMetadata } from "@/lib/seo";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import type { Metadata } from "next";

const EXAMPLE_PROMPTS = [
  "Bantu aku nulis cerita masa kecil",
  "Aku mau dokumentasi perjalanan karir",
  "Bikin refleksi tentang tahun ini",
  "Tulis cerita liburan keluarga",
];

export default function ScribePage() {
  const scribeTransport = new DefaultChatTransport({ api: "/api/scribe" });
  const { messages, sendMessage, status, error } = useChat({
    transport: scribeTransport,
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <Sparkles className="h-8 w-8 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-2">AI Scribe</h1>
        <p className="text-muted-foreground">
          Asisten nulis pribadi. Ceritain apa yang mau ditulis — AI bantu
          menuangkan jadi tulisan enak dibaca.
        </p>
      </div>

      <Separator className="mb-8" />

      <div className="space-y-4 mb-8">
        {messages.map((m, i) => (
          <Card
            key={i}
            className={`border-border/50 ${
              m.role === "user" ? "bg-muted/50" : ""
            }`}
          >
            <CardContent className="pt-6">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                {m.role === "user" ? "Kamu" : "AI Scribe"}
              </p>
              <div className="prose prose-sm max-w-none">
                {m.parts?.map((part, idx) =>
                  part.type === "text" ? (
                    <span key={idx}>{part.text}</span>
                  ) : part.type === "reasoning" ? (
                    <span key={idx} className="text-muted-foreground italic">
                      {part.text}
                    </span>
                  ) : null
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {isLoading && (
          <Card className="border-border/50">
            <CardContent className="pt-6 flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Menulis...</span>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">
                Error: {error.message || "Terjadi kesalahan. Coba lagi."}
              </p>
            </CardContent>
          </Card>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && !isLoading && (
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-3 text-center">
            Atau coba salah satu:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="text-xs px-3 py-1.5 rounded-full border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ceritain mau nulis apa..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        AI Scribe powered by OpenAI/Anthropic. Hasil bisa diedit & dipublikasi
        kapan aja.
      </p>
    </main>
  );
}
