import { resetRateLimitStore } from "@/lib/rate-limit";

const sendEmailMock = vi.fn();
const ResendMock = vi.fn(function ResendMock() {
  return {
    emails: {
      send: sendEmailMock,
    },
  };
});

vi.mock("resend", () => ({
  Resend: ResendMock,
}));

describe("app/api/contact/route", () => {
  beforeEach(() => {
    resetRateLimitStore();
    sendEmailMock.mockReset();
    ResendMock.mockClear();
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
    delete process.env.CONTACT_EMAIL;
  });

  afterEach(() => {
    resetRateLimitStore();
  });

  it("returns 503 when email delivery is not configured", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(
      new Request("http://localhost/api/contact", {
        body: JSON.stringify({
          email: "member@example.com",
          message: "Halo",
          name: "Member",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error:
        "Form kontak belum aktif. Set RESEND_API_KEY untuk mengirim email dari halaman kontak. Kalau app kamu belum butuh form kontak, set NEXT_PUBLIC_ENABLE_CONTACT=false.",
    });
    expect(ResendMock).not.toHaveBeenCalled();
  });

  it("validates required fields", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.CONTACT_EMAIL = "sales@avathur.id";

    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(
      new Request("http://localhost/api/contact", {
        body: JSON.stringify({
          email: "member@example.com",
          name: "Member",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Semua field wajib diisi.",
    });
  });

  it("sends contact requests through Resend", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.EMAIL_FROM = "CMS Bapikir <noreply@avathur.id>";
    process.env.CONTACT_EMAIL = "sales@avathur.id";
    sendEmailMock.mockResolvedValue({ error: null });

    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(
      new Request("http://localhost/api/contact", {
        body: JSON.stringify({
          email: "member@example.com",
          message: "Saya tertarik dengan boilerplate ini.",
          name: "Member",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(ResendMock).toHaveBeenCalledWith("resend-key");
    expect(sendEmailMock).toHaveBeenCalledWith({
      from: "CMS Bapikir <noreply@avathur.id>",
      replyTo: "member@example.com",
      subject: "Pesan baru dari Member — avathur.id",
      text: "Nama: Member\nEmail: member@example.com\n\nPesan:\nSaya tertarik dengan boilerplate ini.",
      to: "sales@avathur.id",
    });
  });

  it("returns 500 when Resend rejects the message", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.CONTACT_EMAIL = "sales@avathur.id";
    sendEmailMock.mockResolvedValue({
      error: {
        message: "quota exceeded",
      },
    });

    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(
      new Request("http://localhost/api/contact", {
        body: JSON.stringify({
          email: "member@example.com",
          message: "Halo",
          name: "Member",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Gagal mengirim pesan.",
    });
  });

  it("rate limits repeated submissions from the same IP", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.CONTACT_EMAIL = "sales@avathur.id";
    sendEmailMock.mockResolvedValue({ error: null });

    const { POST } = await import("@/app/api/contact/route");

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await POST(
        new Request("http://localhost/api/contact", {
          body: JSON.stringify({
            email: "member@example.com",
            message: "Halo",
            name: "Member",
          }),
          headers: {
            "x-forwarded-for": "203.0.113.10",
          },
          method: "POST",
        })
      );

      expect(response.status).toBe(200);
    }

    const response = await POST(
      new Request("http://localhost/api/contact", {
        body: JSON.stringify({
          email: "member@example.com",
          message: "Halo lagi",
          name: "Member",
        }),
        headers: {
          "x-forwarded-for": "203.0.113.10",
        },
        method: "POST",
      })
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      error: "Terlalu banyak pesan. Coba lagi nanti.",
    });
    expect(response.headers.get("retry-after")).toBeTruthy();
  });
});
