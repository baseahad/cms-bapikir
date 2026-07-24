// @vitest-environment jsdom

import { renderHook, waitFor } from "@testing-library/react";

const createClientMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: createClientMock,
}));

vi.mock("@/hooks/use-auth", () => ({
  useAuth: useAuthMock,
}));

describe("hooks/use-subscription", () => {
  beforeEach(() => {
    createClientMock.mockReset();
    useAuthMock.mockReset();
  });

  it("returns an empty state for signed-out users", async () => {
    useAuthMock.mockReturnValue({
      loading: false,
      user: null,
    });

    const { useSubscription } = await import("@/hooks/use-subscription");
    const { result } = renderHook(() => useSubscription());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.subscription).toBeNull();
    expect(result.current.isActive).toBe(false);
    expect(result.current.isPro).toBe(false);
  });

  it("loads the current subscription and derives plan booleans", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: {
        cancel_at_period_end: false,
        created_at: "2026-03-16T12:00:00Z",
        current_period_end: "2026-04-16T12:00:00Z",
        current_period_start: "2026-03-16T12:00:00Z",
        id: "sub-1",
        plan: "PRO",
        status: "ACTIVE",
        updated_at: "2026-03-16T12:00:00Z",
      },
    });

    useAuthMock.mockReturnValue({
      loading: false,
      user: {
        id: "user-1",
      },
    });
    createClientMock.mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: singleMock,
          })),
        })),
      })),
    });

    const { useSubscription } = await import("@/hooks/use-subscription");
    const { result } = renderHook(() => useSubscription());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.subscription?.plan).toBe("PRO");
    expect(result.current.isActive).toBe(true);
    expect(result.current.isPro).toBe(true);
  });
});
