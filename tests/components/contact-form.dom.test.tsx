// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const toast = {
  error: vi.fn(),
  success: vi.fn(),
};

vi.mock("sonner", () => ({
  toast,
}));

describe("components/contact-form", () => {
  beforeEach(() => {
    toast.error.mockReset();
    toast.success.mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("submits the contact form and shows the success state", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
    });

    const { ContactForm } = await import("@/components/contact-form");
    render(<ContactForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Nama"), "Galih");
    await user.type(screen.getByLabelText("Email"), "galih@example.com");
    await user.type(
      screen.getByLabelText("Pesan"),
      "Saya ingin bertanya tentang CMS Bapikir."
    );
    await user.click(screen.getByRole("button", { name: "Kirim Pesan" }));

    await waitFor(() =>
      expect(
        screen.getByText("Terima kasih sudah menghubungi kami. Kami akan balas dalam 1–2 hari kerja.")
      ).toBeInTheDocument()
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Pesan terkirim! Kami akan balas secepatnya."
    );
  });

  it("shows server-side submission errors", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        error: "Gagal mengirim pesan.",
      }),
      ok: false,
    });

    const { ContactForm } = await import("@/components/contact-form");
    render(<ContactForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Nama"), "Galih");
    await user.type(screen.getByLabelText("Email"), "galih@example.com");
    await user.type(screen.getByLabelText("Pesan"), "Halo");
    await user.click(screen.getByRole("button", { name: "Kirim Pesan" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Gagal mengirim pesan.")
    );
  });
});
