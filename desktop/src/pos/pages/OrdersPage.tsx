import { usePOS } from "../context/POSContext";
import { formatMoney } from "../utils";

const CURRENCY = "$";

export default function OrdersPage() {
  const { orders, createNewOrder, paying, cart } = usePOS();

  return (
    <div className="ordersWrap">
      <div className="ordersHeader">
        <div>
          <div className="pageTitle">Orders</div>
          <div className="pageSub">Created orders (local demo + backend create on button)</div>
        </div>

        <button className="pillBtn" onClick={() => createNewOrder("cash")} disabled={paying || !cart.length}>
          {paying ? "Creating..." : "Create order from current cart"}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="posBlock">No orders yet.</div>
      ) : (
        <div className="ordersList">
          {orders.map((o) => (
            <div key={o.id} className="orderCard">
              <div className="orderCardTop">
                <div>
                  <div className="orderCardTitle">{o.customerName}</div>
                  <div className="orderCardSub">
                    {new Date(o.createdAt).toLocaleString()} • {o.paymentMethod.toUpperCase()}
                  </div>
                </div>
                <div className="orderCardTotal">{formatMoney(o.total, CURRENCY)}</div>
              </div>

              <div className="orderItems">
                {o.items.map((it, idx) => (
                  <div key={idx} className="orderItemRow">
                    <span>{it.qty}× {it.name}</span>
                    <span>{formatMoney(it.qty * it.unitPrice, CURRENCY)}</span>
                  </div>
                ))}
              </div>

              <div className="orderCardBottom">
                <div className="miniRow"><span>Subtotal</span><span>{formatMoney(o.subtotal, CURRENCY)}</span></div>
                <div className="miniRow"><span>Tax</span><span>{formatMoney(o.tax, CURRENCY)}</span></div>
                <div className="miniRow strong"><span>Total</span><span>{formatMoney(o.total, CURRENCY)}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
