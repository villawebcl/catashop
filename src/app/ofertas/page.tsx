import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Ofertas",
  description: "Promociones de Catashop con precios especiales y coordinación de compra por WhatsApp.",
  alternates: {
    canonical: "/ofertas",
  },
};

export default function OfertasPage() {
  return (
    <section className="section px-6 sm:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
            Ofertas
          </p>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--ink)] md:text-4xl">
            Promociones para tu día a día
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted)]">
            Selección con precios especiales. Pagos y entregas se coordinan por
            WhatsApp desde Santo Domingo con envío a todo Chile.
          </p>
        </div>
        <div className="mt-10">
          <ProductGrid mode="offers" />
        </div>
      </div>
    </section>
  );
}
