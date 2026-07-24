const createAdminClientMock = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: createAdminClientMock,
  hasServiceRoleEnv: false,
}));

describe("app/api/health/route", () => {
  beforeEach(() => {
    createAdminClientMock.mockReset();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.RESEND_API_KEY;
  });

  it("reports degraded health when required public config is missing", async () => {
    const { GET } = await import("@/app/api/health/route");
    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      checks: {
        resend: false,
        supabase_public: false,
        supabase_service_role: false,
      },
      features: {
        auth: {
          disabled_by_flag: false,
          enabled: false,
          missing_env: [
            "NEXT_PUBLIC_SUPABASE_URL",
            "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
          ],
        },
      },
      status: "degraded",
    });
  });
});
