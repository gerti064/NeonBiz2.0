// src/pages/OrdersPage.tsx  (ONLY FIX: currency consistent + keep as you had)
import { usePOS } from "../context/POSContext";
import { formatMoney } from "../utils";

const CURRENCY = "€";

export default function OrdersPage() {
  const { orders, createNewOrder, paying, cart } = usePOS();

  return (
    <div className="relative h-full w-full bg-[#F3EDE3] text-stone-900">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-52 -left-52 w-[620px] h-[620px] rounded-full bg-emerald-500/10 blur-[110px]" />
        <div className="absolute -bottom-56 -right-56 w-[680px] h-[680px] rounded-full bg-lime-500/10 blur-[120px]" />
      </div>

      <div className="relative h-full px-6 py-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Orders</h1>
            <p className="text-sm text-stone-600">
              Created orders (local demo + backend create on button)
            </p>
          </div>

          <button
            onClick={() => createNewOrder("cash")}
            disabled={paying || !cart.length}
            className={[
              "px-6 py-3 rounded-2xl font-medium transition",
              paying || !cart.length
                ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                : "bg-emerald-800 text-white hover:bg-emerald-700 shadow-[0_14px_36px_rgba(4,120,87,0.28)]",
            ].join(" ")}
          >
            {paying ? "Creating..." : "Create order from current cart"}
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-emerald-900/15 bg-white/70 backdrop-blur-xl p-6 text-stone-600 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            No orders yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {orders.map((o) => (
              <div
                key={o.id}
                className="rounded-3xl border border-emerald-900/15 bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden"
              >
                <div className="flex items-start justify-between p-5 border-b border-emerald-900/10">
                  <div>
                    <div className="text-lg font-semibold">{o.customerName}</div>
                    <div className="flex items-center gap-2 text-sm text-stone-600 mt-1">
                      <span>{new Date(o.createdAt).toLocaleString()}</span>
                      <span
                        className={[
                          "px-3 py-1 rounded-full text-[11px] font-medium border",
                          o.paymentMethod === "cash"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200",
                        ].join(" ")}
                      >
                        {o.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="text-lg font-bold text-stone-900">
                    {formatMoney(o.total, CURRENCY)}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  {o.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-stone-700">
                        {it.qty}× {it.name}
                      </span>
                      <span className="font-medium">
                        {formatMoney(it.qty * it.unitPrice, CURRENCY)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-5 border-t border-emerald-900/10 space-y-2 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>{formatMoney(o.subtotal, CURRENCY)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Tax</span>
                    <span>{formatMoney(o.tax, CURRENCY)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base text-stone-900">
                    <span>Total</span>
                    <span>{formatMoney(o.total, CURRENCY)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
