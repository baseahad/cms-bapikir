const getAuthenticatedUserMock = vi.fn();
const getProfileForCurrentUserMock = vi.fn();
const createAuditLogMock = vi.fn();
const deleteAvatarObjectMock = vi.fn();
const updateProfileForUserMock = vi.fn();

vi.mock("@/lib/data/auth", () => ({
  getAuthenticatedUser: getAuthenticatedUserMock,
}));

vi.mock("@/lib/data/audit-logs", () => ({
  createAuditLog: createAuditLogMock,
}));

vi.mock("@/lib/data/profiles", () => ({
  getProfileForCurrentUser: getProfileForCurrentUserMock,
  updateProfileForUser: updateProfileForUserMock,
}));

vi.mock("@/lib/storage/avatars", () => ({
  deleteAvatarObject: deleteAvatarObjectMock,
}));

describe("app/api/profile/route", () => {
  beforeEach(() => {
    getAuthenticatedUserMock.mockReset();
    getProfileForCurrentUserMock.mockReset();
    createAuditLogMock.mockReset();
    deleteAvatarObjectMock.mockReset();
    updateProfileForUserMock.mockReset();
  });

  it("requires an authenticated user", async () => {
    getAuthenticatedUserMock.mockResolvedValue(null);

    const { POST } = await import("@/app/api/profile/route");
    const response = await POST(
      new Request("http://localhost/api/profile", {
        body: JSON.stringify({ full_name: "Galih" }),
        method: "POST",
      })
    );

    expect(response.status).toBe(401);
  });

  it("updates the current user profile", async () => {
    getAuthenticatedUserMock.mockResolvedValue({
      email: "member@example.com",
      id: "user-1",
    });
    getProfileForCurrentUserMock.mockResolvedValue({
      avatar_path: "user-1/avatar-old",
      avatar_url: null,
      full_name: "Galih",
    });
    updateProfileForUserMock.mockResolvedValue({
      error: null,
    });

    const { POST } = await import("@/app/api/profile/route");
    const response = await POST(
      new Request("http://localhost/api/profile", {
        body: JSON.stringify({
          avatar_path: "user-1/avatar",
          avatar_url: "https://example.com/avatar.png",
          full_name: "Galih Pratama",
        }),
        method: "POST",
      })
    );

    expect(updateProfileForUserMock).toHaveBeenCalledWith("user-1", {
      avatar_path: "user-1/avatar",
      avatar_url: "https://example.com/avatar.png",
      full_name: "Galih Pratama",
    });
    expect(deleteAvatarObjectMock).toHaveBeenCalledWith("user-1/avatar-old");
    expect(createAuditLogMock).toHaveBeenCalledWith(
      expect.objectContaining({
        actorEmail: "member@example.com",
        actorUserId: "user-1",
        type: "profile.update",
      }),
    );
    expect(response.status).toBe(200);
  });
});
