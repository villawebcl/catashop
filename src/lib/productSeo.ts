import type { Product } from "@/lib/types";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);

export const buildProductSlug = (product: Pick<Product, "id" | "name">) => {
  const namePart = slugify(product.name) || "producto";
  return `${namePart}--${product.id}`;
};

export const extractProductIdFromSlug = (slug: string) => {
  const marker = "--";
  const index = slug.lastIndexOf(marker);
  if (index === -1) return slug;
  return slug.slice(index + marker.length);
};

export const buildProductPath = (product: Pick<Product, "id" | "name">) =>
  `/producto/${buildProductSlug(product)}`;

export const buildProductSeoDescription = (product: Product) => {
  const raw =
    product.detail?.trim() ||
    `${product.name} en categoría ${product.category}. Stock actualizado para coordinar compra por WhatsApp.`;
  return raw.length > 155 ? `${raw.slice(0, 152)}...` : raw;
};
