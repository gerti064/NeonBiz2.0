import { useMemo } from "react";
import type { CategoryKey } from "../types";
import { usePOS } from "../context/POSContext";
import ProductGrid from "../components/ProductGrid";
import CartPanel from "../components/CartPanel";

export default function ProductsPage() {
  const { products, tab, setTab, addToCart, loading } = usePOS();

  const filtered = useMemo(
    () => products.filter((p) => p.category === tab),
    [products, tab]
  );

  return (
    <div className="flex h-full">
      {/* CENTER (MENU) */}
      <div className="flex-1 flex flex-col">
        {/* CATEGORY BAR */}
        <div className="bg-emerald-500 px-6 py-4 flex gap-3">
          {(["coffee", "tea", "snack"] as CategoryKey[]).map((c) => {
            const active = tab === c;
            return (
              <button
                key={c}
                onClick={() => setTab(c)}
                className={`
                  px-5 py-2 rounded-lg text-sm font-semibold transition
                  ${
                    active
                      ? "bg-white text-emerald-600"
                      : "text-white/90 hover:bg-white/20"
                  }
                `}
              >
                {c.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* PRODUCTS */}
        <div className="flex-1 overflow-auto p-6 bg-stone-100">
          <ProductGrid
            products={filtered}
            loading={loading}
            onAdd={addToCart}
          />
        </div>
      </div>

      {/* CART */}
      <aside className="w-[380px] bg-white border-l border-stone-200 h-full shrink-0">
        <CartPanel />
      </aside>
    </div>
  );
}
