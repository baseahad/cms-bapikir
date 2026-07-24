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

describe("components/update-password-form", () => {
  beforeEach(() => {
    createClientMock.mockReset();
  });

  it("updates the password and redirects the user", async () => {
    const updateUserMock = vi.fn().mockResolvedValue({
      error: null,
    });

    createClientMock.mockReturnValue({
      auth: {
        updateUser: updateUserMock,
      },
    });

    const { UpdatePasswordForm } = await import(
      "@/components/update-password-form"
    );
    render(<UpdatePasswordForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("New password"), "secret123");
    await user.click(screen.getByRole("button", { name: "Save new password" }));

    await waitFor(() =>
      expect(updateUserMock).toHaveBeenCalledWith({
        password: "secret123",
      })
    );
    expect(routerMock.push).toHaveBeenCalledWith("/dashboard");
  });

  it("shows update errors", async () => {
    const updateUserMock = vi.fn().mockResolvedValue({
      error: new Error("Password too weak"),
    });

    createClientMock.mockReturnValue({
      auth: {
        updateUser: updateUserMock,
      },
    });

    const { UpdatePasswordForm } = await import(
      "@/components/update-password-form"
    );
    render(<UpdatePasswordForm />);

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("New password"), "123");
    await user.click(screen.getByRole("button", { name: "Save new password" }));

    await waitFor(() =>
      expect(screen.getByText("Password too weak")).toBeInTheDocument()
    );
  });
});
