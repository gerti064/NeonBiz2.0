import { formatMoney } from "../utils";
import { usePOS } from "../context/POSContext";

const CURRENCY = "$";

export default function CartPanel() {
  const {
    customerName,
    setCustomerName,
    cart,
    inc,
    dec,
    remove,
    subtotal,
    tax,
    total,
    paying,
    createNewOrder,
    toast,
  } = usePOS();

  return (
    <aside className="orderPanel">
      <div className="panelHeader">
        <div>
          <div className="panelTitle">Cart</div>
          <div className="panelSub">Customer name</div>
        </div>
        <span className="panelChip">Dine in</span>
      </div>

      <div className="panelField">
        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      </div>

      <div className="orderList">
        {cart.length === 0 ? (
          <div className="emptyState">No items yet</div>
        ) : (
          cart.map((i) => (
            <div key={i.productId} className="orderRow">
              <div className="orderMain">
                <div className="orderName">{i.name}</div>
                <div className="orderMeta">{formatMoney(i.price, CURRENCY)}</div>
              </div>

              <div className="qtyBox">
                <button className="qtyBtn" onClick={() => dec(i.productId)}>-</button>
                <div className="qtyVal">{i.qty}</div>
                <button className="qtyBtn" onClick={() => inc(i.productId)}>+</button>
              </div>

              <button className="removeBtn" onClick={() => remove(i.productId)}>✕</button>
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

      <button className="payBtn" onClick={() => createNewOrder("cash")} disabled={paying}>
        {paying ? "Processing..." : "Create order"}
      </button>

      {toast && <div className="toast">{toast}</div>}
    </aside>
  );
}
