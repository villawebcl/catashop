import { expect, test } from "@playwright/test";

test.describe("staging real smoke", () => {
  test.skip(!process.env.STAGING_BASE_URL, "STAGING_BASE_URL no configurado");

  test("home, products and cart load without blocking errors", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Todo lo esencial para tu día a día" })).toBeVisible();

    await page.goto("/productos");
    await expect(page.getByRole("heading", { name: "Colección completa" })).toBeVisible();

    await page.goto("/carrito");
    await expect(page.getByRole("heading", { name: "Tu selección" })).toBeVisible();
  });
});
