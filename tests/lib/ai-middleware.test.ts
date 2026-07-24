const createClientMock = vi.fn();
const isProviderConfiguredMock = vi.fn();
const checkUsageLimitMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}));

vi.mock("@/lib/ai/provider", () => ({
  isProviderConfigured: isProviderConfiguredMock,
}));

vi.mock("@/lib/ai/usage", () => ({
  checkUsageLimit: checkUsageLimitMock,
}));

describe("lib/ai/middleware", () => {
  beforeEach(() => {
    createClientMock.mockReset();
    isProviderConfiguredMock.mockReset();
    checkUsageLimitMock.mockReset();
  });

  it("returns 503 when the provider is not configured", async () => {
    isProviderConfiguredMock.mockReturnValue(false);

    const { authorizeAIRequest } = await import("@/lib/ai/middleware");
    const response = (await authorizeAIRequest("openai")) as Response;

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: 'AI provider "openai" is not configured',
    });
  });

  it("returns 401 when the user is not authenticated", async () => {
    isProviderConfiguredMock.mockReturnValue(true);
    createClientMock.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "No session" },
        }),
      },
    });

    const { authorizeAIRequest } = await import("@/lib/ai/middleware");
    const response = (await authorizeAIRequest("openai")) as Response;

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Unauthorized",
    });
  });

  it("returns 429 when the monthly usage limit is exceeded", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: {
        plan: "PRO",
      },
    });
    const eqMock = vi.fn(() => ({
      single: singleMock,
    }));
    const selectMock = vi.fn(() => ({
      eq: eqMock,
    }));

    isProviderConfiguredMock.mockReturnValue(true);
    checkUsageLimitMock.mockResolvedValue({
      allowed: false,
      limit: 100_000,
      used: 100_000,
    });
    createClientMock.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: {
            claims: {
              email: "member@example.com",
              sub: "user-1",
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        select: selectMock,
      })),
    });

    const { authorizeAIRequest } = await import("@/lib/ai/middleware");
    const response = (await authorizeAIRequest("openai")) as Response;

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      error: "Monthly AI usage limit exceeded",
      limit: 100_000,
      plan: "PRO",
      used: 100_000,
    });
  });

  it("returns the authenticated context when access is allowed", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: null,
    });
    const eqMock = vi.fn(() => ({
      single: singleMock,
    }));
    const selectMock = vi.fn(() => ({
      eq: eqMock,
    }));

    isProviderConfiguredMock.mockReturnValue(true);
    checkUsageLimitMock.mockResolvedValue({
      allowed: true,
      limit: 0,
      used: 0,
    });
    createClientMock.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: {
            claims: {
              email: "member@example.com",
              sub: "user-1",
            },
          },
          error: null,
        }),
      },
      from: vi.fn(() => ({
        select: selectMock,
      })),
    });

    const { authorizeAIRequest } = await import("@/lib/ai/middleware");

    await expect(authorizeAIRequest("openai")).resolves.toEqual({
      email: "member@example.com",
      plan: "FREE",
      userId: "user-1",
    });
    expect(checkUsageLimitMock).toHaveBeenCalledWith("user-1", "FREE");
  });
});
