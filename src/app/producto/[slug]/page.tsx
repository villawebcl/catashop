import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailActions from "@/components/ProductDetailActions";
import { canUseOptimizedImage } from "@/lib/image";
import { formatCLP } from "@/lib/format";
import { getSiteUrl } from "@/lib/siteUrl";
import { buildProductPath, buildProductSeoDescription, extractProductIdFromSlug } from "@/lib/productSeo";
import { getPublicProductById } from "@/lib/products";

type ProductPageParams = {
  slug: string;
};

const siteUrl = getSiteUrl();

const getProductFromParams = async (params: ProductPageParams) => {
  const id = extractProductIdFromSlug(params.slug);
  return getPublicProductById(id);
};

export async function generateMetadata(
  { params }: { params: Promise<ProductPageParams> },
): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductFromParams(resolvedParams);
  if (!product) {
    return {
      title: "Producto no encontrado",
      robots: { index: false, follow: false },
    };
  }

  const path = buildProductPath(product);
  const canonicalUrl = `${siteUrl}${path}`;
  const description = buildProductSeoDescription(product);

  return {
    title: `${product.name} | Catashop`,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: product.name,
      description,
      url: canonicalUrl,
      type: "website",
      images: product.image_url ? [{ url: product.image_url }] : [{ url: `${siteUrl}/icon-512.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : [`${siteUrl}/icon-512.png`],
    },
  };
}

export default async function ProductDetailPage(
  { params }: { params: Promise<ProductPageParams> },
) {
  const resolvedParams = await params;
  const product = await getProductFromParams(resolvedParams);
  if (!product) {
    notFound();
  }

  const productUrl = `${siteUrl}${buildProductPath(product)}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image_url ? [product.image_url] : [`${siteUrl}/icon-512.png`],
    description: buildProductSeoDescription(product),
    sku: product.readable_id ?? product.id,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "Catashop",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "CLP",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <section className="section px-6 sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
          {product.image_url ? (
            canUseOptimizedImage(product.image_url) ? (
              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
              Sin imagen
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--muted)]">{product.category}</p>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--ink)] md:text-4xl">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-[var(--accent-strong)]">{formatCLP(product.price)}</p>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {product.detail || "Producto disponible para coordinar compra por WhatsApp."}
          </p>
          <p className="text-sm text-[var(--muted)]">Stock disponible: {product.stock}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <ProductDetailActions product={product} />
            <Link
              href="/productos"
              className="rounded-lg border border-[var(--line)] px-6 py-3 text-sm text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Volver a productos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
