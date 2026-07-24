const createClientMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}));

describe("lib/ai/usage", () => {
  beforeEach(() => {
    createClientMock.mockReset();
  });

  it("tracks usage rows in the ai_usage table", async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    const fromMock = vi.fn(() => ({
      insert: insertMock,
    }));

    createClientMock.mockResolvedValue({
      from: fromMock,
    });

    const { trackUsage } = await import("@/lib/ai/usage");

    await trackUsage("user-1", "openai", "gpt-4o", 12, 34);

    expect(fromMock).toHaveBeenCalledWith("ai_usage");
    expect(insertMock).toHaveBeenCalledWith({
      completion_tokens: 34,
      model: "gpt-4o",
      prompt_tokens: 12,
      provider: "openai",
      user_id: "user-1",
    });
  });

  it("returns the current month's total usage", async () => {
    const gteMock = vi.fn().mockResolvedValue({
      data: [
        { completion_tokens: 5, prompt_tokens: 10 },
        { completion_tokens: 2, prompt_tokens: 3 },
      ],
    });
    const eqMock = vi.fn(() => ({
      gte: gteMock,
    }));
    const selectMock = vi.fn(() => ({
      eq: eqMock,
    }));
    const fromMock = vi.fn(() => ({
      select: selectMock,
    }));

    createClientMock.mockResolvedValue({
      from: fromMock,
    });

    const { getMonthlyUsage } = await import("@/lib/ai/usage");
    const total = await getMonthlyUsage("user-1");

    expect(total).toBe(20);
    expect(fromMock).toHaveBeenCalledWith("ai_usage");
    expect(selectMock).toHaveBeenCalledWith("prompt_tokens, completion_tokens");
    expect(eqMock).toHaveBeenCalledWith("user_id", "user-1");
    expect(gteMock).toHaveBeenCalledWith(
      "created_at",
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
    );
  });

  it("allows unlimited plans without reading usage", async () => {
    const usageModule = await import("@/lib/ai/usage");
    const usageSpy = vi.spyOn(usageModule, "getMonthlyUsage");

    await expect(
      usageModule.checkUsageLimit("user-1", "ULTIMATE")
    ).resolves.toEqual({
      allowed: true,
      limit: Number.POSITIVE_INFINITY,
      used: 0,
    });

    expect(usageSpy).not.toHaveBeenCalled();
  });

  it("blocks plans that exceed their monthly limit", async () => {
    const usageModule = await import("@/lib/ai/usage");

    createClientMock.mockResolvedValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            gte: vi.fn().mockResolvedValue({
              data: [
                {
                  completion_tokens: 5_000,
                  prompt_tokens: 5_000,
                },
              ],
            }),
          })),
        })),
      })),
    });

    await expect(
      usageModule.checkUsageLimit("user-1", "BASIC")
    ).resolves.toEqual({
      allowed: false,
      limit: 10_000,
      used: 10_000,
    });
  });
});
