import { expect, test } from "@playwright/test";

test("homepage renders the primary SaaS hero", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /Boilerplate SaaS untuk/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Mulai Gratis", exact: true })).toBeVisible();
});

test("about page explains the product positioning", async ({ page }) => {
  await page.goto("/about");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Dibikin untuk developer Indonesia yang mau ship lebih cepat\./i,
    }),
  ).toBeVisible();
});

test("status page shows the configured service dashboard", async ({ page }) => {
  await page.goto("/status");

  await expect(page.getByRole("heading", { level: 1, name: "Status Layanan" })).toBeVisible();
  await expect(page.getByText("Payment — Transfer Manual")).toBeVisible();
});
