import type { CartItem } from "@/lib/types";

const checkoutClientKeyStorage = "catashop-checkout-client-key";

export type CheckoutItemPayload = {
  id: string;
  quantity: number;
};

export const toCheckoutItemPayload = (items: CartItem[]): CheckoutItemPayload[] =>
  items.map((item) => ({
    id: item.id,
    quantity: Math.max(1, Math.min(item.quantity, 99)),
  }));

export const getOrCreateCheckoutClientKey = (): string => {
  if (typeof window === "undefined") return "server";
  const existing = localStorage.getItem(checkoutClientKeyStorage);
  if (existing) return existing;

  const created = crypto.randomUUID();
  localStorage.setItem(checkoutClientKeyStorage, created);
  return created;
};
