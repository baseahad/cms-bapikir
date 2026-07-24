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

describe("components/sign-up-form", () => {
  beforeEach(() => {
    createClientMock.mockReset();
  });

  it("prevents submission when passwords do not match", async () => {
    const signUpMock = vi.fn();

    createClientMock.mockReturnValue({
      auth: {
        signInWithOAuth: vi.fn(),
        signUp: signUpMock,
      },
    });

    const { SignUpForm } = await import("@/components/sign-up-form");
    render(<SignUpForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Ulangi Password"), "wrong123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    expect(screen.getByText("Password tidak cocok")).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("creates the account and redirects to the success screen", async () => {
    const signUpMock = vi.fn().mockResolvedValue({
      error: null,
    });

    createClientMock.mockReturnValue({
      auth: {
        signInWithOAuth: vi.fn(),
        signUp: signUpMock,
      },
    });

    const { SignUpForm } = await import("@/components/sign-up-form");
    render(<SignUpForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Ulangi Password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    await waitFor(() =>
      expect(signUpMock).toHaveBeenCalledWith({
        email: "member@example.com",
        options: {
          emailRedirectTo: "http://localhost:3000/auth/confirm",
        },
        password: "secret123",
      })
    );
    expect(routerMock.push).toHaveBeenCalledWith("/auth/sign-up-success");
  });
});
