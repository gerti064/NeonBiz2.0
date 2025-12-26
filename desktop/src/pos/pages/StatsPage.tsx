import { useEffect, useMemo, useState } from "react";
import { usePOS } from "../context/POSContext";
import { formatMoney } from "../utils";
import { fetchProducts, type Product } from "./products";

const CURRENCY = "$";

export default function StatsPage() {
  const { orders, ordersCountToday } = usePOS();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const items = await fetchProducts(true);
        if (!alive) return;
        setProducts(items);
      } catch (e: any) {
        if (!alive) return;
        setProductsError(e?.message ?? "Failed to load products");
      } finally {
        if (!alive) return;
        setProductsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const avg = orders.length ? totalRevenue / orders.length : 0;

    return {
      totalRevenue,
      totalOrders: orders.length,
      ordersCountToday,
      avgOrder: avg,
    };
  }, [orders, ordersCountToday]);

  return (
    <div className="relative h-full w-full bg-[#F3EDE3] text-stone-900 overflow-y-auto">
      {/* subtle beige / emerald glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-52 -left-52 w-[620px] h-[620px] rounded-full bg-emerald-500/10 blur-[110px]" />
        <div className="absolute -bottom-56 -right-56 w-[680px] h-[680px] rounded-full bg-lime-500/10 blur-[120px]" />
      </div>

      <div className="relative p-8">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Statistics</h1>
          <p className="text-sm text-stone-600">
            Live overview (orders + products)
          </p>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total revenue"
            value={formatMoney(stats.totalRevenue, CURRENCY)}
          />
          <StatCard
            label="Total orders"
            value={stats.totalOrders.toString()}
          />
          <StatCard
            label="Today (backend)"
            value={stats.ordersCountToday.toString()}
          />
          <StatCard
            label="Avg order"
            value={formatMoney(stats.avgOrder, CURRENCY)}
          />
        </div>

        {/* PRODUCTS PANEL */}
        <div className="bg-white/70 border border-emerald-900/15 rounded-2xl shadow-[0_18px_44px_rgba(0,0,0,0.08)] backdrop-blur">
          <div className="p-5 border-b border-emerald-900/10">
            <h2 className="text-lg font-semibold">Products</h2>
            <p className="text-sm text-stone-600">
              Live data from backend
            </p>
          </div>

          <div className="p-5">
            {productsLoading ? (
              <div className="text-stone-500 text-sm">
                Loading products…
              </div>
            ) : productsError ? (
              <div className="text-rose-600 text-sm">
                {productsError}
              </div>
            ) : products.length === 0 ? (
              <div className="text-stone-500 text-sm">
                No products found.
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 10).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl border border-emerald-900/15 bg-white/60 px-4 py-3"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">
                        {p.name}
                      </div>
                      <div className="text-xs text-stone-600">
                        {p.category}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-stone-900">
                        {formatMoney(p.price, CURRENCY)}
                      </div>
                      <div
                        className={[
                          "text-xs font-medium",
                          p.isActive
                            ? "text-emerald-700"
                            : "text-stone-400",
                        ].join(" ")}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>
                ))}

                {products.length > 10 && (
                  <div className="text-xs text-stone-600 pt-2">
                    Showing first 10 products…
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable stat card ---------- */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/70 border border-emerald-900/15 rounded-2xl p-6 backdrop-blur shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
      <div className="text-sm text-stone-600 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-stone-900">
        {value}
      </div>
    </div>
  );
}
