const createClientMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}));

describe("app/auth/confirm/route", () => {
  beforeEach(() => {
    vi.resetModules();
    createClientMock.mockReset();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "anon-key";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  });

  it("redirects to the error page when auth is not configured", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const { GET } = await import("@/app/auth/confirm/route");

    await expect(
      GET(new Request("http://localhost/auth/confirm?code=abc123") as never)
    ).rejects.toThrow(
      "NEXT_REDIRECT:/auth/error?error=Supabase%20auth%20belum%20aktif.%20Isi%20NEXT_PUBLIC_SUPABASE_URL%2C%20NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY%20untuk%20mengaktifkan%20login%2C%20signup%2C%20dan%20dashboard.%20Kalau%20app%20kamu%20belum%20butuh%20auth%2C%20set%20NEXT_PUBLIC_ENABLE_AUTH%3Dfalse."
    );
  });

  it("exchanges auth codes and redirects to the requested page", async () => {
    createClientMock.mockResolvedValue({
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
          error: null,
        }),
        verifyOtp: vi.fn(),
      },
    });

    const { GET } = await import("@/app/auth/confirm/route");

    await expect(
      GET(
        new Request(
          "http://localhost/auth/confirm?code=abc123&next=%2Fdashboard"
        ) as never
      )
    ).rejects.toThrow("NEXT_REDIRECT:/dashboard");
  });

  it("redirects auth code failures to the error page", async () => {
    createClientMock.mockResolvedValue({
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({
          error: {
            message: "Code invalid",
          },
        }),
        verifyOtp: vi.fn(),
      },
    });

    const { GET } = await import("@/app/auth/confirm/route");

    await expect(
      GET(
        new Request("http://localhost/auth/confirm?code=abc123") as never
      )
    ).rejects.toThrow("NEXT_REDIRECT:/auth/error?error=Code invalid");
  });

  it("verifies OTP links and redirects to the provided next path", async () => {
    createClientMock.mockResolvedValue({
      auth: {
        exchangeCodeForSession: vi.fn(),
        verifyOtp: vi.fn().mockResolvedValue({
          error: null,
        }),
      },
    });

    const { GET } = await import("@/app/auth/confirm/route");

    await expect(
      GET(
        new Request(
          "http://localhost/auth/confirm?token_hash=hash123&type=magiclink&next=%2Fdashboard%2Fbilling"
        ) as never
      )
    ).rejects.toThrow("NEXT_REDIRECT:/dashboard/billing");
  });

  it("redirects missing tokens to the error page", async () => {
    createClientMock.mockResolvedValue({
      auth: {
        exchangeCodeForSession: vi.fn(),
        verifyOtp: vi.fn(),
      },
    });

    const { GET } = await import("@/app/auth/confirm/route");

    await expect(
      GET(new Request("http://localhost/auth/confirm") as never)
    ).rejects.toThrow("NEXT_REDIRECT:/auth/error?error=No token hash or type");
  });
});
