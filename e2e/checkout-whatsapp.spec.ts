import { expect, test } from "@playwright/test";

test("smoke checkout opens WhatsApp popup after secure order registration", async ({ page }) => {
  const seededCart = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Producto E2E",
      price: 15990,
      stock: 20,
      category: "Hogar",
      code: "E2E-001",
      image_url: null,
      detail: "Producto de prueba",
      quantity: 1,
    },
  ];

  await page.addInitScript((items) => {
    localStorage.setItem("aurora-cart", JSON.stringify(items));
  }, seededCart);

  await page.route("**/rest/v1/rpc/create_order_secure", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          order_id: "22222222-2222-2222-2222-222222222222",
          order_total: 15990,
          order_items: seededCart,
        },
      ]),
    });
  });

  await page.goto("/carrito");
  await expect(page.getByRole("heading", { name: "Tu selección" })).toBeVisible();

  await page.getByRole("button", { name: "Continuar Compra" }).click();
  await expect(page.getByRole("heading", { name: "Datos de Envío" })).toBeVisible();

  await page.getByLabel("Nombre Completo").fill("Usuario E2E");
  await page.getByLabel("RUT").fill("12.345.678-9");
  await page.getByLabel("Dirección de Envío").fill("Calle E2E 123");
  await page.getByLabel("Correo Electrónico").fill("e2e@catashop.cl");
  await page.getByLabel("Teléfono Móvil").fill("+56911111111");

  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Confirmar y Enviar a WhatsApp" }).click();
  const popup = await popupPromise;

  await expect.poll(() => popup.url()).toContain("https://wa.me/");
  await expect.poll(() => popup.url()).toContain("PEDIDO");
});
