// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { routerMock } from "../test-helpers/next";

const createClientMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: createClientMock,
}));

vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();

  return {
    ...actual,
    hasEnvVars: () => true,
  };
});

describe("components/login-form", () => {
  beforeEach(() => {
    createClientMock.mockReset();
  });

  it("logs in with email and password", async () => {
    const signInWithPasswordMock = vi.fn().mockResolvedValue({
      error: null,
    });

    createClientMock.mockReturnValue({
      auth: {
        signInWithOAuth: vi.fn(),
        signInWithOtp: vi.fn(),
        signInWithPassword: signInWithPasswordMock,
      },
    });

    const { LoginForm } = await import("@/components/login-form");
    render(<LoginForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Masuk" }));

    await waitFor(() =>
      expect(signInWithPasswordMock).toHaveBeenCalledWith({
        email: "member@example.com",
        password: "secret123",
      })
    );
    expect(routerMock.push).toHaveBeenCalledWith("/dashboard");
  });

  it("sends a magic link and shows confirmation", async () => {
    const signInWithOtpMock = vi.fn().mockResolvedValue({
      error: null,
    });

    createClientMock.mockReturnValue({
      auth: {
        signInWithOAuth: vi.fn(),
        signInWithOtp: signInWithOtpMock,
        signInWithPassword: vi.fn(),
      },
    });

    const { LoginForm } = await import("@/components/login-form");
    render(<LoginForm />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Magic Link" }));
    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.click(screen.getByRole("button", { name: "Kirim Magic Link" }));

    await waitFor(() =>
      expect(signInWithOtpMock).toHaveBeenCalledWith({
        email: "member@example.com",
        options: {
          emailRedirectTo: "http://localhost:3000/auth/confirm",
        },
      })
    );
    expect(
      screen.getByText(/Cek email kamu — link login udah dikirim ke/)
    ).toBeInTheDocument();
  });

  it("shows Google auth errors", async () => {
    createClientMock.mockReturnValue({
      auth: {
        signInWithOAuth: vi.fn().mockResolvedValue({
          error: new Error("Google auth unavailable"),
        }),
        signInWithOtp: vi.fn(),
        signInWithPassword: vi.fn(),
      },
    });

    const { LoginForm } = await import("@/components/login-form");
    render(<LoginForm />);

    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: "Lanjutkan dengan Google" })
    );

    await waitFor(() =>
      expect(screen.getByText("Google auth unavailable")).toBeInTheDocument()
    );
  });
});
