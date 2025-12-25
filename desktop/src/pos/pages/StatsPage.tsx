import { useEffect, useMemo, useState } from "react";
import { usePOS } from "../context/POSContext";
import { formatMoney } from "../utils";
import { fetchProducts, type Product } from "./products";

const CURRENCY = "$";

export default function StatsPage() {
  const { orders, ordersCountToday } = usePOS();

  // ✅ NEW: products from backend
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
    <div className="statsWrap">
      <div className="pageTitle">Statistics</div>
      <div className="pageSub">
        Demo stats for now (based on locally created orders) + live products check
      </div>

      <div className="statsGrid">
        <div className="statCard">
          <div className="statLabel">Total revenue</div>
          <div className="statValue">{formatMoney(stats.totalRevenue, CURRENCY)}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Total orders</div>
          <div className="statValue">{stats.totalOrders}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Today (backend count)</div>
          <div className="statValue">{stats.ordersCountToday}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Avg order</div>
          <div className="statValue">{formatMoney(stats.avgOrder, CURRENCY)}</div>
        </div>
      </div>

      {/* ✅ NEW: quick products wire-up (visual proof) */}
      <div style={{ height: 16 }} />

      <div className="statCard" style={{ padding: 14 }}>
        <div className="statLabel">Products (live from backend)</div>

        {productsLoading ? (
          <div className="statValue" style={{ fontSize: 14, opacity: 0.8 }}>
            Loading products...
          </div>
        ) : productsError ? (
          <div className="statValue" style={{ fontSize: 14, color: "#d64b4b" }}>
            {productsError}
          </div>
        ) : (
          <>
            <div className="statValue" style={{ fontSize: 22 }}>
              {products.length}
            </div>

            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {products.slice(0, 10).map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "10px 12px",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.8)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontWeight: 800 }}>{p.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{p.category}</div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 900 }}>{formatMoney(p.price, CURRENCY)}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      Active: {p.isActive ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length > 10 && (
              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                Showing first 10 products…
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
