import robots from "@/app/robots";
import { siteConfig } from "@/config/site";

describe("app/robots", () => {
  it("returns the public crawl rules and sitemap location", () => {
    expect(robots()).toEqual({
      rules: [
        {
          allow: "/",
          disallow: ["/api/", "/admin/", "/auth/", "/dashboard/", "/order/"],
          userAgent: "*",
        },
      ],
      sitemap: `${siteConfig.url}/sitemap.xml`,
    });
  });
});
