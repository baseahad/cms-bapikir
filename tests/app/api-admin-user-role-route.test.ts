const getAuthenticatedUserMock = vi.fn();
const isAdminUserMock = vi.fn();
const createAuditLogMock = vi.fn();
const setUserRoleForUserMock = vi.fn();

vi.mock("@/lib/data/auth", () => ({
  getAuthenticatedUser: getAuthenticatedUserMock,
}));

vi.mock("@/lib/data/audit-logs", () => ({
  createAuditLog: createAuditLogMock,
}));

vi.mock("@/lib/data/user-roles", () => ({
  isAdminUser: isAdminUserMock,
  setUserRoleForUser: setUserRoleForUserMock,
}));

describe("app/api/admin/users/role/route", () => {
  beforeEach(() => {
    getAuthenticatedUserMock.mockReset();
    isAdminUserMock.mockReset();
    createAuditLogMock.mockReset();
    setUserRoleForUserMock.mockReset();
  });

  it("requires an authenticated admin", async () => {
    getAuthenticatedUserMock.mockResolvedValue(null);

    const { POST } = await import("@/app/api/admin/users/role/route");
    const response = await POST(
      new Request("http://localhost/api/admin/users/role", {
        body: JSON.stringify({
          role: "admin",
          user_id: "0f07a5cf-7175-4eab-b6e1-45ca0a4d88e1",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(401);
  });

  it("forbids non-admin users", async () => {
    getAuthenticatedUserMock.mockResolvedValue({
      email: "member@example.com",
      id: "0f07a5cf-7175-4eab-b6e1-45ca0a4d88e1",
    });
    isAdminUserMock.mockResolvedValue(false);

    const { POST } = await import("@/app/api/admin/users/role/route");
    const response = await POST(
      new Request("http://localhost/api/admin/users/role", {
        body: JSON.stringify({
          role: "admin",
          user_id: "3b018469-28c2-4f83-8b37-f318a60ab71d",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(403);
  });

  it("updates another user's role", async () => {
    getAuthenticatedUserMock.mockResolvedValue({
      email: "admin@example.com",
      id: "0f07a5cf-7175-4eab-b6e1-45ca0a4d88e1",
    });
    isAdminUserMock.mockResolvedValue(true);
    setUserRoleForUserMock.mockResolvedValue({
      error: null,
    });

    const { POST } = await import("@/app/api/admin/users/role/route");
    const response = await POST(
      new Request("http://localhost/api/admin/users/role", {
        body: JSON.stringify({
          role: "admin",
          user_id: "3b018469-28c2-4f83-8b37-f318a60ab71d",
        }),
        method: "POST",
      })
    );

    expect(setUserRoleForUserMock).toHaveBeenCalledWith(
      "3b018469-28c2-4f83-8b37-f318a60ab71d",
      "admin",
    );
    expect(createAuditLogMock).toHaveBeenCalledWith(
      expect.objectContaining({
        actorEmail: "admin@example.com",
        actorUserId: "0f07a5cf-7175-4eab-b6e1-45ca0a4d88e1",
        type: "admin.action",
      }),
    );
    expect(response.status).toBe(200);
  });

  it("prevents an admin from demoting their own active account", async () => {
    getAuthenticatedUserMock.mockResolvedValue({
      email: "admin@example.com",
      id: "0f07a5cf-7175-4eab-b6e1-45ca0a4d88e1",
    });
    isAdminUserMock.mockResolvedValue(true);

    const { POST } = await import("@/app/api/admin/users/role/route");
    const response = await POST(
      new Request("http://localhost/api/admin/users/role", {
        body: JSON.stringify({
          role: "member",
          user_id: "0f07a5cf-7175-4eab-b6e1-45ca0a4d88e1",
        }),
        method: "POST",
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Admin tidak bisa menurunkan role akun sendiri.",
    });
  });
});
