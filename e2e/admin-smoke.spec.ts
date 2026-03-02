import { expect, test } from "@playwright/test";

const mockProduct = {
  id: "33333333-3333-3333-3333-333333333333",
  readable_id: "P-SEED-1",
  name: "Producto Admin",
  price: 12990,
  stock: 12,
  category: "Hogar",
  code: "SEED-ADMIN-1",
  detail: "Producto de prueba admin",
  image_url: null,
  is_featured: false,
  is_offer: false,
  created_at: "2026-03-02T12:00:00.000Z",
};

const mockOrder = {
  id: "44444444-4444-4444-4444-444444444444",
  readable_id: "ORD-E2E-1",
  created_at: "2026-03-02T12:10:00.000Z",
  status: "new",
  total: 12990,
  items: [
    {
      id: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
      stock: 0,
      category: mockProduct.category,
      code: mockProduct.code,
      image_url: null,
      detail: mockProduct.detail,
      quantity: 1,
    },
  ],
};

test("admin smoke: login and mark order as sold", async ({ page }) => {
  let markSoldRpcCalled = false;

  await page.route("**/auth/v1/token?grant_type=password", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "fake-access-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "fake-refresh-token",
        user: {
          id: "55555555-5555-5555-5555-555555555555",
          aud: "authenticated",
          role: "authenticated",
          email: "admin@catashop.cl",
        },
      }),
    });
  });

  await page.route("**/auth/v1/user", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ message: "JWT expired" }),
    });
  });

  await page.route("**/rest/v1/products?*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([mockProduct]),
    });
  });

  await page.route("**/rest/v1/orders?*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([mockOrder]),
    });
  });

  await page.route("**/rest/v1/rpc/mark_order_sold_secure", async (route) => {
    markSoldRpcCalled = true;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          order_id: mockOrder.id,
          new_status: "sold",
        },
      ]),
    });
  });

  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await page.goto("/admin");

  await page.getByPlaceholder("Email").fill("admin@catashop.cl");
  await page.getByPlaceholder("Contraseña").fill("secret123");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByText("Panel de Control")).toBeVisible();
  await page.getByRole("button", { name: "Pedidos" }).click();
  await expect(page.getByText("ORD-E2E-1")).toBeVisible();

  await page.getByTitle("Marcar como vendido y descontar stock").click();
  await expect(page.getByText("Orden marcada como vendida y stock actualizado.")).toBeVisible();
  expect(markSoldRpcCalled).toBeTruthy();
});
