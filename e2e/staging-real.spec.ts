import { expect, test } from "@playwright/test";

test.describe("staging real smoke", () => {
  test.skip(!process.env.STAGING_BASE_URL, "STAGING_BASE_URL no configurado");

  test("home, products and cart load without blocking errors", async ({ page }) => {
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
      } else {
        expect(nonceHeader).toBeTruthy();
        const hasScriptNonce = await page.evaluate(() => Boolean(document.querySelector("script[nonce]")));
        expect(hasScriptNonce).toBe(true);
      }
    }

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("main")).toBeVisible();

    await page.goto("/productos");
    await expect(page).toHaveURL(/\/productos$/);
    await expect(page.locator("main")).toBeVisible();

    await page.goto("/carrito");
    await expect(page).toHaveURL(/\/carrito$/);
    await expect(page.getByRole("heading", { name: /Tu selección/i })).toBeVisible();
  });
});
