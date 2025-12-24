import { useMemo } from "react";
import type { CategoryKey } from "../types";
import { usePOS } from "../context/POSContext";
import ProductGrid from "../components/ProductGrid";
import CartPanel from "../components/CartPanel";

export default function ProductsPage() {
  const { loading, products, tab, setTab, addToCart } = usePOS();

  const filtered = useMemo(() => {
    return products.filter((p) => p.category === tab);
  }, [products, tab]);

  return (
    <div className="posMain">
      <section className="leftCol">
        <div className="tabs">
          {(["coffee", "tea", "snack"] as CategoryKey[]).map((c) => (
            <button
              key={c}
              className={`tab ${tab === c ? "tabActive" : ""}`}
              onClick={() => setTab(c)}
            >
              <div className="tabIcon">
                {c === "coffee" ? "☕" : c === "tea" ? "🍵" : "🥐"}
              </div>
              <div className="tabCol">
                <div className="tabLabel">{c.charAt(0).toUpperCase() + c.slice(1)}</div>
              </div>
            </button>
          ))}
        </div>

        <ProductGrid products={filtered} loading={loading} onAdd={addToCart} />
      </section>

      <CartPanel />
    </div>
  );
}
