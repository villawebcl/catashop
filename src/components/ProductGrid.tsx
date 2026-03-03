"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase/client";
import ProductModal from "@/components/ProductModal";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type ProductGridProps = {
  mode?: "all" | "featured" | "offers";
  searchTerm?: string;
};

export default function ProductGrid({
  mode = "all",
  searchTerm = "",
}: ProductGridProps) {
  const prefersReducedMotion = useReducedMotion();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const load = async () => {
      if (!isMounted) return;
      setLoading(true);
      setError(null);

      if (!supabase) {
        setError("Configura las variables de Supabase en .env.local.");
        setLoading(false);
        return;
      }

      timeoutId = setTimeout(() => {
        if (!isMounted) return;
        setError("No se pudieron cargar los productos. Revisa la conexión e inténtalo nuevamente.");
        setLoading(false);
      }, 15_000);

      try {
        let query = supabase.from("products").select("*").order("created_at", {
          ascending: false,
        });

        if (mode === "featured") {
          query = query.eq("is_featured", true);
        }
        if (mode === "offers") {
          query = query.eq("is_offer", true);
        }

        const { data, error: queryError } = await query;
        if (!isMounted) return;

        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (queryError) {
          setError("No se pudieron cargar los productos.");
        } else {
          setProducts((data ?? []) as Product[]);
        }
        setLoading(false);
      } catch {
        if (!isMounted) return;
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        setError("No se pudieron cargar los productos.");
        setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [mode]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        (product.detail ?? "").toLowerCase().includes(term),
    );
  }, [products, searchTerm]);

  const shouldAnimateCards =
    !prefersReducedMotion && filteredProducts.length > 0 && filteredProducts.length <= 18;

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="col-span-full rounded-[28px] border border-dashed border-[var(--line)] p-10 text-center text-sm text-[var(--muted)]">
          Cargando colección...
        </div>
      );
    }
    if (error) {
      return (
        <div className="col-span-full rounded-[28px] border border-dashed border-[var(--line)] p-10 text-center text-sm text-[var(--muted)]">
          {error}
        </div>
      );
    }
    if (filteredProducts.length === 0) {
      return (
        <div className="col-span-full rounded-[28px] border border-dashed border-[var(--line)] p-10 text-center text-sm text-[var(--muted)]">
          No hay resultados para esta búsqueda.
        </div>
      );
    }
    const cards = filteredProducts.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        enableMotion={shouldAnimateCards}
        onView={(item) => setSelectedProduct(item)}
      />
    ));

    if (!shouldAnimateCards) return cards;
    return <AnimatePresence mode="popLayout">{cards}</AnimatePresence>;
  }, [loading, error, filteredProducts, shouldAnimateCards]);

  return (
    <>
      <motion.div
        layout
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {content}
      </motion.div>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
