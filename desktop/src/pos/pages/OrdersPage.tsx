import { usePOS } from "../context/POSContext";
import { formatMoney } from "../utils";

const CURRENCY = "$";

export default function OrdersPage() {
  const { orders, createNewOrder, paying, cart } = usePOS();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-gray-500">
            Created orders (local demo + backend create on button)
          </p>
        </div>

        <button
          onClick={() => createNewOrder("cash")}
          disabled={paying || !cart.length}
          className={`
            px-6 py-3 rounded-xl font-medium transition
            ${
              paying || !cart.length
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }
          `}
        >
          {paying ? "Creating..." : "Create order from current cart"}
        </button>
      </div>

      {/* CONTENT */}
      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-500">
          No orders yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              {/* TOP */}
              <div className="flex items-start justify-between p-5 border-b border-gray-100">
                <div>
                  <div className="text-lg font-semibold">
                    {o.customerName}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span>
                      {new Date(o.createdAt).toLocaleString()}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${
                          o.paymentMethod === "cash"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >
                      {o.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-lg font-bold text-gray-900">
                  {formatMoney(o.total, CURRENCY)}
                </div>
              </div>

              {/* ITEMS */}
              <div className="p-5 space-y-2">
                {o.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {it.qty}× {it.name}
                    </span>
                    <span>
                      {formatMoney(it.qty * it.unitPrice, CURRENCY)}
                    </span>
                  </div>
                ))}
              </div>

              {/* TOTALS */}
              <div className="p-5 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatMoney(o.subtotal, CURRENCY)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatMoney(o.tax, CURRENCY)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base text-gray-900">
                  <span>Total</span>
                  <span>{formatMoney(o.total, CURRENCY)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
