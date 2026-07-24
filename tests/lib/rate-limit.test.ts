import {
  getAiRateLimitConfig,
  resetRateLimitStore,
  takeRateLimit,
} from "@/lib/rate-limit";

describe("lib/rate-limit", () => {
  beforeEach(() => {
    resetRateLimitStore();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    resetRateLimitStore();
  });

  it("blocks after the configured limit and resets after the window", async () => {
    const config = {
      key: "127.0.0.1",
      limit: 2,
      namespace: "contact",
      windowMs: 1_000,
    };

    await expect(takeRateLimit(config)).resolves.toMatchObject({
      allowed: true,
      remaining: 1,
    });
    await expect(takeRateLimit(config)).resolves.toMatchObject({
      allowed: true,
      remaining: 0,
    });
    await expect(takeRateLimit(config)).resolves.toMatchObject({
      allowed: false,
      remaining: 0,
      retryAfter: 1,
    });

    vi.advanceTimersByTime(1_001);

    await expect(takeRateLimit(config)).resolves.toMatchObject({
      allowed: true,
      remaining: 1,
    });
  });

  it("assigns larger AI limits to higher plans", () => {
    expect(getAiRateLimitConfig("user-1", "FREE").limit).toBe(10);
    expect(getAiRateLimitConfig("user-1", "PRO").limit).toBe(40);
    expect(getAiRateLimitConfig("user-1", "ULTIMATE").limit).toBe(80);
  });
});
