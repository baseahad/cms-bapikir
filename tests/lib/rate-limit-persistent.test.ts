describe("lib/rate-limit persistent backend", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    vi.doUnmock("@/lib/supabase/admin");
  });

  it("uses the Supabase-backed limiter when the service role client is available", async () => {
    const rpcMock = vi.fn().mockResolvedValue({
      data: [
        {
          allowed: false,
          limit: 5,
          remaining: 0,
          reset_at: "2026-03-17T00:05:00.000Z",
          retry_after: 60,
        },
      ],
      error: null,
    });
    const ltMock = vi.fn().mockResolvedValue({ error: null });
    const deleteMock = vi.fn(() => ({
      lt: ltMock,
    }));
    const fromMock = vi.fn(() => ({
      delete: deleteMock,
    }));

    vi.doMock("@/lib/supabase/admin", () => ({
      createAdminClient: () => ({
        from: fromMock,
        rpc: rpcMock,
      }),
      hasServiceRoleEnv: true,
    }));

    const { takeRateLimit } = await import("@/lib/rate-limit");

    const result = await takeRateLimit({
      key: "203.0.113.10",
      limit: 5,
      namespace: "contact",
      windowMs: 60_000,
    });

    expect(rpcMock).toHaveBeenCalledWith("consume_rate_limit", {
      p_limit: 5,
      p_namespace: "contact",
      p_subject_key: "203.0.113.10",
      p_window_seconds: 60,
    });
    expect(result).toMatchObject({
      allowed: false,
      limit: 5,
      remaining: 0,
      retryAfter: 60,
    });
  });
});
