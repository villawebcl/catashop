"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatCLP } from "@/lib/format";
import { useCart } from "@/components/CartContext";
import { canUseOptimizedImage } from "@/lib/image";

type ProductCardProps = {
  product: Product;
  onView: (product: Product) => void;
  enableMotion?: boolean;
};

export default function ProductCard({
  product,
  onView,
  enableMotion = true,
}: ProductCardProps) {
  const { addItem } = useCart();

  const content = (
    <>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--sand)]">
        {product.image_url ? (
          canUseOptimizedImage(product.image_url) ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-[var(--font-display)] text-lg leading-tight text-[var(--ink)]">
              {product.name}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
              {product.category}
            </p>
          </div>
          <span className="text-xl font-semibold text-[var(--ink)]">
            {formatCLP(product.price)}
          </span>
        </div>
        {product.detail && (
          <p className="text-sm leading-relaxed text-[var(--muted)]">{product.detail}</p>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={(event) => {
            event.stopPropagation();
            addItem(product);
          }}
          className="mt-auto rounded-lg bg-[var(--accent)] px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-[var(--accent-strong)]"
        >
          Agregar al Carrito
        </motion.button>
      </div>
    </>
  );

  if (!enableMotion) {
    return (
      <article
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)] shadow-sm transition-shadow hover:shadow-md"
        onClick={() => onView(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onView(product);
          }
        }}
      >
        {content}
      </article>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)] shadow-sm transition-shadow hover:shadow-md"
      onClick={() => onView(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onView(product);
        }
      }}
    >
      {content}
    </motion.article>
  );
}
