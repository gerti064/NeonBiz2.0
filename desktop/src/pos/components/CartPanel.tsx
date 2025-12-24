// src/components/CartPanel.tsx
import React from "react";
import { usePOS } from "../context/POSContext";

export default function CartPanel() {
  const {
    cart,
    inc,
    dec,
    remove,
    clearCart,
    subtotal,
    total,
    paying,

    checkoutMode,
    setCheckoutMode,
    tabNameDraft,
    setTabNameDraft,
    completeCart,

    toast,
  } = usePOS();

  return (
    <aside className="orderPanel">
      {/* COMPACT HEADER */}
      <div className="panelHeader panelHeaderCompact">
        <div>
          <div className="panelTitle panelTitleCompact">Cart</div>
          <div className="panelSub">{cart.length} items</div>
        </div>

        <button
          className="panelChip panelChipCompact"
          onClick={clearCart}
          disabled={!cart.length}
          type="button"
        >
          Clear
        </button>
      </div>

      {/* CHECKOUT MODE */}
      <div className="panelSectionTitle">Checkout</div>
      <div className="checkoutModeRow">
        <button
          className={`modeBtn ${checkoutMode === "payNow" ? "modeBtnActive" : ""}`}
          onClick={() => setCheckoutMode("payNow")}
          type="button"
        >
          Pay now
        </button>

        <button
          className={`modeBtn ${checkoutMode === "tab" ? "modeBtnActive" : ""}`}
          onClick={() => setCheckoutMode("tab")}
          type="button"
        >
          Add to tab
        </button>
      </div>

      {/* TAB NAME (ONLY WHEN TAB MODE) */}
      {checkoutMode === "tab" && (
        <div className="panelField" style={{ marginTop: 8 }}>
          <input
            value={tabNameDraft}
            onChange={(e) => setTabNameDraft(e.target.value)}
            placeholder='Tab name (e.g. "Table 4")'
          />
        </div>
      )}

      {/* ITEMS */}
      <div className="panelSectionTitle">Items</div>
      <div className="orderList">
        {cart.length === 0 ? (
          <div className="emptyState">No items</div>
        ) : (
          cart.map((i) => (
            <div className="orderRow" key={i.productId}>
              <div className="orderMain">
                <div className="orderName">{i.name}</div>
                <div className="orderMeta">{i.price.toFixed(0)} den</div>
              </div>

              <div className="qtyBox">
                <button
                  className="qtyBtn"
                  onClick={() => dec(i.productId)}
                  type="button"
                >
                  −
                </button>
                <div className="qtyVal">{i.qty}</div>
                <button
                  className="qtyBtn"
                  onClick={() => inc(i.productId)}
                  type="button"
                >
                  +
                </button>
              </div>

              <button
                className="removeBtn"
                onClick={() => remove(i.productId)}
                type="button"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* TOTALS */}
      <div className="panelSectionTitle">Total</div>
      <div className="totals">
        <div className="totRow totStrong">
          <span>Total</span>
          <span>{total.toFixed(0)} den</span>
        </div>
      </div>

      {/* COMPLETE ORDER */}
      {checkoutMode === "tab" ? (
        <button
          className="payBtn"
          disabled={paying || cart.length === 0 || !tabNameDraft.trim()}
          onClick={() => completeCart("cash")}
          type="button"
        >
          {paying ? "Saving..." : "Complete (save to tab)"}
        </button>
      ) : (
        <button
          className="payBtn"
          disabled={paying || cart.length === 0}
          onClick={() => completeCart("cash")}
          type="button"
        >
          {paying ? "Processing..." : "Complete order"}
        </button>
      )}

      {toast && <div className="toast">{toast}</div>}
    </aside>
  );
}
