import React, { useMemo } from "react";
import type { CategoryKey } from "../types";
import { usePOS } from "../context/POSContext";
import ProductGrid from "../components/ProductGrid";
import CartPanel from "../components/CartPanel";

const CATEGORIES: { key: CategoryKey; label: string; badge?: string; icon: string }[] = [
  { key: "coffee", label: "Coffee", badge: "Available", icon: "☕" },
  { key: "tea", label: "Tea", badge: "Available", icon: "🍵" },
  { key: "snack", label: "Snack", badge: "Need restock", icon: "🍪" },
];

export default function ProductsPage() {
  const { products, tab, setTab, addToCart, loading } = usePOS();

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) map[p.category] = (map[p.category] ?? 0) + 1;
    return map as Record<CategoryKey, number>;
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => p.category === tab);
  }, [products, tab]);

  return (
    <div className="relative h-full w-full bg-[#F3EDE3] text-stone-900">
      {/* subtle beige glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-52 -left-52 w-[620px] h-[620px] rounded-full bg-emerald-500/10 blur-[110px]" />
        <div className="absolute -bottom-56 -right-56 w-[680px] h-[680px] rounded-full bg-lime-500/10 blur-[120px]" />
      </div>

      <div className="relative flex h-full">
        {/* LEFT + CENTER */}
        <div className="flex-1 min-w-0 flex flex-col px-6 py-6">
          {/* Categories (outlined, bigger, icons) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {CATEGORIES.map((c) => {
              const active = tab === c.key;
              const count = counts[c.key] ?? 0;

              return (
                <button
                  key={c.key}
                  onClick={() => setTab(c.key)}
                  className={[
                    "relative w-full rounded-2xl border transition text-left overflow-hidden",
                    "px-5 py-5 min-h-[92px] flex items-center justify-between gap-4",
                    active
                      ? "bg-emerald-800 border-emerald-800 text-white shadow-[0_18px_44px_rgba(4,120,87,0.22)]"
                      : "bg-white/55 border-emerald-900/20 text-stone-900 hover:bg-white/70",
                  ].join(" ")}
                >
                  {/* faint big icon watermark */}
                  <div
                    className={[
                      "absolute right-4 top-3 text-[44px] leading-none select-none",
                      active ? "opacity-25" : "opacity-15",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {c.icon}
                  </div>

                  <div className="relative flex items-center gap-4 min-w-0">
                    <div
                      className={[
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-[20px] shrink-0",
                        active ? "bg-white/15" : "bg-emerald-900/5 border border-emerald-900/10",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {c.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="text-base font-semibold truncate">{c.label}</div>
                      <div className={active ? "text-[12px] text-white/80" : "text-[12px] text-stone-600"}>
                        {count} items
                      </div>
                    </div>
                  </div>

                  {c.badge && (
                    <span
                      className={[
                        "relative shrink-0 rounded-full px-3 py-1 text-[11px] font-medium border",
                        active
                          ? "bg-white/10 text-white border-white/15"
                          : c.key === "snack"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200",
                      ].join(" ")}
                    >
                      {c.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Products (NO outer “box/card” — open area like your screenshot) */}
          <div className="flex-1 min-h-0 mt-5 overflow-auto">
            <div className="mb-3">
              <div className="text-lg font-semibold">Menu</div>
              <div className="text-xs text-stone-600">
                {tab.toUpperCase()} • {filtered.length} items
              </div>
            </div>

            {/* No wrapper card here */}
            <ProductGrid products={filtered} loading={loading} onAdd={addToCart} />
          </div>
        </div>

        {/* RIGHT CART */}
        <aside className="w-[400px] h-full shrink-0 p-6 pl-0">
          <div className="h-full rounded-3xl border border-emerald-900/15 bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
            <CartPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
