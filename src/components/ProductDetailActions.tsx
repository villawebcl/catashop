"use client";

import { useCart } from "@/components/CartContext";
import type { Product } from "@/lib/types";

type ProductDetailActionsProps = {
  product: Product;
};

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-strong)]"
    >
      Agregar al carrito
    </button>
  );
}
