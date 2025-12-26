import React from "react";
import { formatMoney } from "../utils";

const CURRENCY = "€";

type ProductLike = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  available?: boolean;
  description?: string;
};

export default function ProductGrid({
  products,
  loading,
  onAdd,
}: {
  products: ProductLike[];
  loading: boolean;
  onAdd: (product: ProductLike) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden animate-pulse"
          >
            <div className="h-36 bg-stone-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-2/3 bg-stone-200 rounded" />
              <div className="h-3 w-1/2 bg-stone-200 rounded" />
              <div className="h-5 w-1/3 bg-stone-200 rounded mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="h-full flex items-center justify-center text-stone-500">
        No products found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((p) => {
        const disabled = p.available === false;

        return (
          <div
            key={p.id}
            onClick={() => !disabled && onAdd(p)}
            className={[
              "bg-white rounded-3xl border overflow-hidden shadow-sm transition relative cursor-pointer",
              disabled
                ? "border-stone-200 opacity-60 cursor-not-allowed"
                : "border-stone-200 hover:shadow-md hover:scale-[1.01]",
            ].join(" ")}
          >
            {/* Image */}
            <div className="h-36 bg-stone-100 overflow-hidden">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  No image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="font-semibold text-stone-900 truncate">
                {p.name}
              </div>
              <div className="text-xs text-stone-500">
                {p.description ?? "Freshly prepared"}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="font-extrabold text-emerald-700">
                  {formatMoney(p.price, CURRENCY)}
                </div>

                {/* Plus button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    if (!disabled) onAdd(p);
                  }}
                  disabled={disabled}
                  className={[
                    "w-11 h-11 rounded-full flex items-center justify-center font-black text-lg transition",
                    disabled
                      ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                      : "bg-emerald-700 text-white hover:bg-emerald-800",
                  ].join(" ")}
                >
                  +
                </button>
              </div>

              {disabled && (
                <div className="mt-3 text-xs font-semibold text-rose-600">
                  Need to restock
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
