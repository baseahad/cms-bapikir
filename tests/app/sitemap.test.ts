const getAllPublishedPostsMock = vi.fn();

vi.mock("@/lib/data/blog", () => ({
  getAllPublishedPosts: getAllPublishedPostsMock,
}));

describe("app/sitemap", () => {
  beforeEach(() => {
    getAllPublishedPostsMock.mockReset();
    getAllPublishedPostsMock.mockResolvedValue([
      {
        slug: "contoh-artikel",
        created_at: "2026-07-01T00:00:00.000Z",
        updated_at: "2026-07-05T00:00:00.000Z",
      },
    ]);
  });

  it("includes the static routes and published blog posts", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = await sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          priority: 1,
          url: "https://avathur.id",
        }),
        expect.objectContaining({
          priority: 0.8,
          url: "https://avathur.id/blog",
        }),
        expect.objectContaining({
          url: "https://avathur.id/blog/contoh-artikel",
        }),
      ])
    );
  });
});
