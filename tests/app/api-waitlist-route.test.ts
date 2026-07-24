import { resetRateLimitStore } from "@/lib/rate-limit";

const createClientMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}));

describe("app/api/waitlist/route", () => {
  beforeEach(() => {
    vi.resetModules();
    resetRateLimitStore();
    createClientMock.mockReset();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "anon-key";
  });

  afterEach(() => {
    resetRateLimitStore();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  });

  it("returns 503 when waitlist storage is not configured", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const { POST } = await import("@/app/api/waitlist/route");
    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        body: JSON.stringify({
          email: "member@example.com",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error:
        "Waitlist butuh Supabase public env dan tabel waitlist yang sudah dimigrasikan. Isi NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY atau set NEXT_PUBLIC_ENABLE_WAITLIST=false kalau page ini belum dipakai.",
    });
  });

  it("validates email addresses", async () => {
    const { POST } = await import("@/app/api/waitlist/route");
    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        body: JSON.stringify({
          email: "invalid-email",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Email tidak valid.",
    });
  });

  it("inserts waitlist entries and normalizes the WhatsApp number", async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });

    createClientMock.mockResolvedValue({
      from: vi.fn(() => ({
        insert: insertMock,
      })),
    });

    const { POST } = await import("@/app/api/waitlist/route");
    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        body: JSON.stringify({
          email: "member@example.com",
          name: "Member",
          wa: "+6281234567890",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(insertMock).toHaveBeenCalledWith({
      email: "member@example.com",
      name: "Member",
      wa: "081234567890",
    });
  });

  it("returns 409 for duplicate emails", async () => {
    const insertMock = vi.fn().mockResolvedValue({
      error: {
        code: "23505",
      },
    });

    createClientMock.mockResolvedValue({
      from: vi.fn(() => ({
        insert: insertMock,
      })),
    });

    const { POST } = await import("@/app/api/waitlist/route");
    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        body: JSON.stringify({
          email: "member@example.com",
          name: "Member",
          wa: "081234567890",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "Email sudah terdaftar.",
    });
  });

  it("returns 500 for unexpected insert errors", async () => {
    const insertMock = vi.fn().mockResolvedValue({
      error: {
        code: "XX000",
      },
    });

    createClientMock.mockResolvedValue({
      from: vi.fn(() => ({
        insert: insertMock,
      })),
    });

    const { POST } = await import("@/app/api/waitlist/route");
    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        body: JSON.stringify({
          email: "member@example.com",
          name: "Member",
          wa: "081234567890",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Gagal mendaftar. Coba lagi.",
    });
  });

  it("rate limits repeated signups from the same IP", async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });

    createClientMock.mockResolvedValue({
      from: vi.fn(() => ({
        insert: insertMock,
      })),
    });

    const { POST } = await import("@/app/api/waitlist/route");

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await POST(
        new Request("http://localhost/api/waitlist", {
          body: JSON.stringify({
            email: `member${attempt}@example.com`,
            name: "Member",
            wa: "081234567890",
          }),
          headers: {
            "x-forwarded-for": "198.51.100.8",
          },
          method: "POST",
        })
      );

      expect(response.status).toBe(200);
    }

    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        body: JSON.stringify({
          email: "member-final@example.com",
          name: "Member",
          wa: "081234567890",
        }),
        headers: {
          "x-forwarded-for": "198.51.100.8",
        },
        method: "POST",
      })
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      error: "Terlalu banyak pendaftaran. Coba lagi nanti.",
    });
  });
});
