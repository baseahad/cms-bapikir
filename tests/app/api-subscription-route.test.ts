const getAuthenticatedUserMock = vi.fn();
const cancelSubscriptionAtPeriodEndMock = vi.fn();
const resumeSubscriptionMock = vi.fn();
const syncExpiredSubscriptionMock = vi.fn();

vi.mock("@/lib/data/auth", () => ({
  getAuthenticatedUser: getAuthenticatedUserMock,
}));

vi.mock("@/lib/data/subscriptions", () => ({
  cancelSubscriptionAtPeriodEnd: cancelSubscriptionAtPeriodEndMock,
  resumeSubscription: resumeSubscriptionMock,
  syncExpiredSubscription: syncExpiredSubscriptionMock,
}));

describe("app/api/subscription/route", () => {
  beforeEach(() => {
    getAuthenticatedUserMock.mockReset();
    cancelSubscriptionAtPeriodEndMock.mockReset();
    resumeSubscriptionMock.mockReset();
    syncExpiredSubscriptionMock.mockReset();
  });

  it("requires an authenticated user", async () => {
    getAuthenticatedUserMock.mockResolvedValue(null);

    const { POST } = await import("@/app/api/subscription/route");
    const response = await POST(
      new Request("http://localhost/api/subscription", {
        body: JSON.stringify({ action: "cancel" }),
        method: "POST",
      })
    );

    expect(response.status).toBe(401);
  });

  it("cancels subscription at period end", async () => {
    getAuthenticatedUserMock.mockResolvedValue({
      email: "member@example.com",
      id: "user-1",
    });

    const { POST } = await import("@/app/api/subscription/route");
    const response = await POST(
      new Request("http://localhost/api/subscription", {
        body: JSON.stringify({ action: "cancel" }),
        method: "POST",
      })
    );

    expect(syncExpiredSubscriptionMock).toHaveBeenCalledWith("user-1");
    expect(cancelSubscriptionAtPeriodEndMock).toHaveBeenCalledWith("user-1");
    expect(response.status).toBe(200);
  });

  it("resumes subscription", async () => {
    getAuthenticatedUserMock.mockResolvedValue({
      email: "member@example.com",
      id: "user-1",
    });

    const { POST } = await import("@/app/api/subscription/route");
    const response = await POST(
      new Request("http://localhost/api/subscription", {
        body: JSON.stringify({ action: "resume" }),
        method: "POST",
      })
    );

    expect(resumeSubscriptionMock).toHaveBeenCalledWith("user-1");
    expect(response.status).toBe(200);
  });
});
