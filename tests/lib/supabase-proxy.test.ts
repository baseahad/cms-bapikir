const createServerClientMock = vi.fn();

describe("lib/supabase/proxy", () => {
  beforeEach(() => {
    vi.resetModules();
    createServerClientMock.mockReset();
  });

  it("skips session refresh when Supabase env vars are missing", async () => {
    vi.doMock("@/lib/utils", () => ({
      hasEnvVars: false,
    }));
    vi.doMock("@supabase/ssr", () => ({
      createServerClient: createServerClientMock,
    }));

    const { NextRequest } = await import("next/server");
    const { updateSession } = await import("@/lib/supabase/proxy");
    const response = await updateSession(
      new NextRequest("http://localhost/dashboard")
    );

    expect(response.status).toBe(200);
    expect(createServerClientMock).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated protected routes to login", async () => {
    vi.doMock("@/lib/utils", () => ({
      hasEnvVars: true,
    }));
    vi.doMock("@supabase/ssr", () => ({
      createServerClient: createServerClientMock,
    }));

    createServerClientMock.mockReturnValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: null,
        }),
      },
    });

    const { NextRequest } = await import("next/server");
    const { updateSession } = await import("@/lib/supabase/proxy");
    const response = await updateSession(
      new NextRequest("http://localhost/dashboard")
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/auth/login"
    );
  });

  it("keeps public marketing routes accessible when signed out", async () => {
    vi.doMock("@/lib/utils", () => ({
      hasEnvVars: true,
    }));
    vi.doMock("@supabase/ssr", () => ({
      createServerClient: createServerClientMock,
    }));

    createServerClientMock.mockReturnValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: null,
        }),
      },
    });

    const { NextRequest } = await import("next/server");
    const { updateSession } = await import("@/lib/supabase/proxy");
    const response = await updateSession(
      new NextRequest("http://localhost/about")
    );

    expect(response.status).toBe(200);
  });

  it("preserves cookie updates for authenticated requests", async () => {
    vi.doMock("@/lib/utils", () => ({
      hasEnvVars: true,
    }));
    vi.doMock("@supabase/ssr", () => ({
      createServerClient: createServerClientMock,
    }));

    createServerClientMock.mockImplementation(
      (_url: string, _key: string, options: { cookies: { setAll: (cookies: { name: string; options?: { path?: string }; value: string }[]) => void } }) => ({
        auth: {
          getClaims: vi.fn().mockImplementation(async () => {
            options.cookies.setAll([
              {
                name: "sb-access-token",
                options: { path: "/" },
                value: "token",
              },
            ]);

            return {
              data: {
                claims: {
                  sub: "user-1",
                },
              },
            };
          }),
        },
      })
    );

    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";

    const { NextRequest } = await import("next/server");
    const { updateSession } = await import("@/lib/supabase/proxy");
    const response = await updateSession(new NextRequest("http://localhost/"));

    expect(response.status).toBe(200);
    expect(response.cookies.get("sb-access-token")?.value).toBe("token");
  });
});
