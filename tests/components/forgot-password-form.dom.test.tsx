// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

describe("components/forgot-password-form", () => {
  beforeEach(() => {
    createClientMock.mockReset();
  });

  it("requests a password reset and shows the success state", async () => {
    const resetPasswordForEmailMock = vi.fn().mockResolvedValue({
      error: null,
    });

    createClientMock.mockReturnValue({
      auth: {
        resetPasswordForEmail: resetPasswordForEmailMock,
      },
    });

    const { ForgotPasswordForm } = await import(
      "@/components/forgot-password-form"
    );
    render(<ForgotPasswordForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset email" }));

    await waitFor(() =>
      expect(resetPasswordForEmailMock).toHaveBeenCalledWith(
        "member@example.com",
        {
          redirectTo: "http://localhost:3000/auth/update-password",
        }
      )
    );
    expect(screen.getByText("Check Your Email")).toBeInTheDocument();
  });
});
