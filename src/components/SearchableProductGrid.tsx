"use client";

import { useDeferredValue, useId, useState } from "react";
import ProductGrid from "@/components/ProductGrid";

type SearchableProductGridProps = {
  mode?: "all" | "featured" | "offers";
  title: string;
  description?: string;
};

export default function SearchableProductGrid({
  mode = "all",
  title,
  description,
}: SearchableProductGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const searchId = useId();

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-[var(--font-display)] text-3xl text-[var(--ink)]">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
          )}
        </div>
        <div className="w-full md:w-72">
          <label htmlFor={searchId} className="sr-only">
            Buscar productos por nombre, categoría o detalle
          </label>
          <input
            id={searchId}
            type="text"
            placeholder="Buscar productos"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-full border border-[var(--line)] bg-transparent px-5 py-3 text-sm"
          />
        </div>
      </div>
      <div className="mt-10">
        <ProductGrid mode={mode} searchTerm={deferredSearchTerm} />
      </div>
    </div>
  );
}
