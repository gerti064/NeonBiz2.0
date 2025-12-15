import { useEffect, useMemo, useState } from "react";
import { createOrder, getOrdersCountToday, getProducts } from "./api";
import type { CartItem, CategoryKey, Product } from "./types";
import { calcSubtotal, calcTax, formatMoney, isoDateLabel } from "./utils";

const TAX_RATE = 0.0;
const CURRENCY = "$";

export default function POSPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<CategoryKey>("coffee");
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("Mudz");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, count] = await Promise.all([
          getProducts(),
          getOrdersCountToday(),
        ]);
        setProducts(p);
        setOrdersCount(count);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.category === tab &&
        (!q || p.name.toLowerCase().includes(q))
    );
  }, [products, tab, search]);

  const subtotal = useMemo(() => calcSubtotal(cart), [cart]);
  const tax = useMemo(() => calcTax(subtotal, TAX_RATE), [subtotal]);
  const total = subtotal + tax;

  function addToCart(p: Product) {
    if (!p.available) {
      setToast("Item not available");
      return;
    }

    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [
        ...prev,
        { productId: p.id, name: p.name, price: p.price, qty: 1 },
      ];
    });
  }

  function inc(id: string) {
    setCart((prev) =>
      prev.map((i) =>
        i.productId === id ? { ...i, qty: i.qty + 1 } : i
      )
    );
  }

  function dec(id: string) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === id ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );
  }

  function remove(id: string) {
    setCart((prev) => prev.filter((i) => i.productId !== id));
  }

  async function payNow() {
    if (!cart.length) {
      setToast("Cart is empty");
      return;
    }

    setPaying(true);
    try {
      await createOrder({
        customerName,
        items: cart.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          unitPrice: i.price,
          name: i.name,
        })),
        paymentMethod: "cash",
      });

      setCart([]);
      setOrdersCount((c) => c + 1);
      setToast("Order placed");
    } catch {
      setToast("Failed to place order");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="pos">
      <header className="posTopbar">
        <div className="brand">
          <div className="brandMark">GC</div>
          <div>
            <div className="brandTitle">Green Grounds Coffee</div>
            <div className="brandSub">{isoDateLabel()}</div>
          </div>
        </div>

        <div className="topMeta">
          <span>Total</span>
          <strong>{ordersCount} Orders</strong>
          <button className="pillBtn">Export</button>
          <button className="iconBtn">🔔</button>
          <button className="avatar">G</button>
        </div>
      </header>

      <main className="posMain">
        <section className="leftCol">
          <div className="searchRow">
            <div className="search">
              <span className="searchIcon">🔎</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
              />
              {search && (
                <button className="clearBtn" onClick={() => setSearch("")}>
                  ✕
                </button>
              )}
            </div>
          </div>

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
                  <div className="tabLabel">
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="productGrid">
            {loading ? (
              <div>Loading...</div>
            ) : (
              filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className={`productCard ${
                    !p.available ? "productDisabled" : ""
                  }`}
                >
                  <div className={`chip ${p.available ? "chipOk" : "chipBad"}`}>
                    {p.available ? "Available" : "Need to stock"}
                  </div>

                  <div className="productImg">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} />
                    ) : (
                      <div className="imgFallback">
                        {p.name[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="productInfo">
                    <div className="productName">{p.name}</div>
                    <div className="productPrice">
                      {formatMoney(p.price, CURRENCY)}
                    </div>
                  </div>

                  <button
                    className="addBtn"
                    onClick={() => addToCart(p)}
                    disabled={!p.available}
                  >
                    +
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="orderPanel">
          <div className="panelHeader">
            <div>
              <div className="panelTitle">Purchase</div>
              <div className="panelSub">Customer name</div>
            </div>
            <span className="panelChip">Dine in</span>
          </div>

          <div className="panelField">
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="orderList">
            {cart.length === 0 ? (
              <div className="emptyState">No items yet</div>
            ) : (
              cart.map((i) => (
                <div key={i.productId} className="orderRow">
                  <div className="orderMain">
                    <div className="orderName">{i.name}</div>
                    <div className="orderMeta">
                      {formatMoney(i.price, CURRENCY)}
                    </div>
                  </div>

                  <div className="qtyBox">
                    <button className="qtyBtn" onClick={() => dec(i.productId)}>
                      -
                    </button>
                    <div className="qtyVal">{i.qty}</div>
                    <button className="qtyBtn" onClick={() => inc(i.productId)}>
                      +
                    </button>
                  </div>

                  <button
                    className="removeBtn"
                    onClick={() => remove(i.productId)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="totals">
            <div className="totRow">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal, CURRENCY)}</span>
            </div>
            <div className="totRow">
              <span>Tax</span>
              <span>{formatMoney(tax, CURRENCY)}</span>
            </div>
            <div className="totRow totStrong">
              <span>Total</span>
              <span>{formatMoney(total, CURRENCY)}</span>
            </div>
          </div>

          <button className="payBtn" onClick={payNow} disabled={paying}>
            {paying ? "Processing..." : "Pay now"}
          </button>

          {toast && <div className="toast">{toast}</div>}
        </aside>
      </main>
    </div>
  );
}
