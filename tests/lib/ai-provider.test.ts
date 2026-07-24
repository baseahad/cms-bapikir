const openaiMock = vi.fn((modelId: string) => ({
  modelId,
  provider: "openai",
}));
const anthropicMock = vi.fn((modelId: string) => ({
  modelId,
  provider: "anthropic",
}));
const googleMock = vi.fn((modelId: string) => ({
  modelId,
  provider: "google",
}));

vi.mock("@ai-sdk/openai", () => ({
  openai: openaiMock,
}));

vi.mock("@ai-sdk/anthropic", () => ({
  anthropic: anthropicMock,
}));

vi.mock("@ai-sdk/google", () => ({
  google: googleMock,
}));

describe("lib/ai/provider", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.AI_DEFAULT_PROVIDER;
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  });

  it("uses the configured default provider when none is provided", async () => {
    process.env.AI_DEFAULT_PROVIDER = "anthropic";

    const { getModel } = await import("@/lib/ai/provider");
    const model = getModel();

    expect(model).toEqual({
      modelId: "claude-sonnet-4-20250514",
      provider: "anthropic",
    });
    expect(anthropicMock).toHaveBeenCalledWith("claude-sonnet-4-20250514");
  });

  it("returns the requested provider model", async () => {
    const { getModel } = await import("@/lib/ai/provider");
    const model = getModel("openai");

    expect(model).toEqual({
      modelId: "gpt-4o",
      provider: "openai",
    });
    expect(openaiMock).toHaveBeenCalledWith("gpt-4o");
  });

  it("returns the requested Google model", async () => {
    const { getModel } = await import("@/lib/ai/provider");
    const model = getModel("google");

    expect(model).toEqual({
      modelId: "gemini-2.5-flash",
      provider: "google",
    });
    expect(googleMock).toHaveBeenCalledWith("gemini-2.5-flash");
  });

  it("checks whether provider keys are configured", async () => {
    process.env.OPENAI_API_KEY = "openai-key";

    const { isProviderConfigured } = await import("@/lib/ai/provider");

    expect(isProviderConfigured("openai")).toBe(true);
    expect(isProviderConfigured("anthropic")).toBe(false);
    expect(isProviderConfigured("google")).toBe(false);
  });

  it("recognizes a configured Google API key", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "google-key";

    const { isProviderConfigured } = await import("@/lib/ai/provider");

    expect(isProviderConfigured("google")).toBe(true);
  });
});
