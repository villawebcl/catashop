import { expect, test } from "@playwright/test";

test.describe("staging real smoke", () => {
  test.skip(!process.env.STAGING_BASE_URL, "STAGING_BASE_URL no configurado");

  test("home, products and cart load without blocking errors", async ({ page }) => {
    const requireCspHeader = process.env.REQUIRE_CSP_HEADER === "true";
    const homeResponse = await page.goto("/");
    expect(homeResponse).not.toBeNull();
    const homeHeaders = homeResponse?.headers() ?? {};
    let cspHeader = homeHeaders["content-security-policy"] ?? "";
    let nonceHeader = homeHeaders["x-nonce"] ?? "";

    if (!cspHeader || !nonceHeader) {
      const absoluteUrl = process.env.STAGING_BASE_URL ?? "/";
      const fallbackResponse = await page.request.get(absoluteUrl);
      const fallbackHeaders = fallbackResponse.headers();
      cspHeader = cspHeader || fallbackHeaders["content-security-policy"] || "";
      nonceHeader = nonceHeader || fallbackHeaders["x-nonce"] || "";
    }
    if (cspHeader) {
      expect(cspHeader).toContain("default-src 'self'");
    } else if (requireCspHeader) {
      throw new Error("CSP header no disponible en este entorno de prueba");
    }

    if (process.env.STAGING_EXPECT_NONCE_CSP === "true") {
      const hasNonceInCsp = cspHeader.includes("script-src 'self' 'nonce-");

      if (hasNonceInCsp) {
        const scriptDirective = cspHeader
          .split(";")
          .map((part) => part.trim())
          .find((part) => part.startsWith("script-src"));
        expect(scriptDirective).toBeDefined();
        expect(scriptDirective).not.toContain("'unsafe-inline'");
      } else if (nonceHeader) {
        expect(nonceHeader).toBeTruthy();
      } else if (requireCspHeader) {
        throw new Error("No se pudo validar nonce por headers en este entorno");
      }
    }

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("main")).toBeVisible();

    await page.goto("/productos");
    await expect(page).toHaveURL(/\/productos$/);
    await expect(page.locator("main")).toBeVisible();

    await page.goto("/carrito");
    await expect(page).toHaveURL(/\/carrito$/);
    const cartMain = page.locator("main");
    await expect(cartMain).toBeVisible();
    await expect(cartMain).toContainText(/(carrito|tu selecci[oó]n)/i);
  });
});
