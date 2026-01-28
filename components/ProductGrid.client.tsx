"use client";

import { useState } from "react";
import type { ProductCard } from "@/lib/shopify/query";
import { QuickViewModal } from "./QuickViewModal";

export function ProductGridClient({ products }: { products: ProductCard[] }) {
  const [open, setOpen] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  function onQuickView(handle: string) {
    setActiveHandle(handle);
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="rounded-lg border border-white/10 p-3">
            {p.featuredImage && (
              <img
                src={p.featuredImage.url}
                alt={p.featuredImage.altText ?? p.title}
                className="aspect-square w-full rounded-md object-cover"
              />
            )}

            <div className="mt-3">
              <h2 className="text-sm font-medium">{p.title}</h2>
              <p className="text-sm opacity-70">
                {p.priceRange.minVariantPrice.amount}{" "}
                {p.priceRange.minVariantPrice.currencyCode}
              </p>

              <button
                onClick={() => onQuickView(p.handle)}
                className="mt-2 text-sm underline opacity-80 hover:opacity-100"
              >
                Quick View
              </button>
            </div>
          </div>
        ))}
      </div>

      <QuickViewModal
        open={open}
        productHandle={activeHandle}
        onClose={onClose}
      />
    </>
  );
}
