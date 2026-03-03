import { expect, test } from "@playwright/test";

test.describe("checkout real smoke", () => {
  test.skip(!process.env.STAGING_BASE_URL, "STAGING_BASE_URL no configurado");

  test("can add one product and reach checkout form without sending order", async ({ page }) => {
    await page.goto("/productos");
    await expect(page).toHaveURL(/\/productos$/);
    await expect(page.locator("main")).toBeVisible();

    const addButtons = page.getByRole("button", { name: /Agregar al Carrito/i });
    await expect(addButtons.first()).toBeVisible();
    await addButtons.first().click();

    await page.goto("/carrito");
    await expect(page).toHaveURL(/\/carrito$/);

    const continueButton = page.getByRole("button", { name: /Continuar Compra/i });
    await expect(continueButton).toBeVisible();
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    await expect(page.getByRole("heading", { name: /Datos de Envío/i })).toBeVisible();
  });
});
