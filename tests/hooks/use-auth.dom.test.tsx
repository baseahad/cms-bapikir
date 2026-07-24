// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";

const createClientMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: createClientMock,
}));

vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();

  return {
    ...actual,
    hasEnvVars: true,
  };
});

describe("hooks/use-auth", () => {
  beforeEach(() => {
    createClientMock.mockReset();
  });

  it("loads the current user, reacts to auth changes, and unsubscribes on unmount", async () => {
    const unsubscribeMock = vi.fn();
    let authListener:
      | ((event: string, session: { user: { email: string; id: string } } | null) => void)
      | undefined;

    createClientMock.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              email: "member@example.com",
              id: "user-1",
            },
          },
        }),
        onAuthStateChange: vi.fn((listener) => {
          authListener = listener;

          return {
            data: {
              subscription: {
                unsubscribe: unsubscribeMock,
              },
            },
          };
        }),
      },
    });

    const { useAuth } = await import("@/hooks/use-auth");
    const { result, unmount } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user?.email).toBe("member@example.com");

    act(() => {
      authListener?.("SIGNED_OUT", null);
    });

    expect(result.current.user).toBeNull();

    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
