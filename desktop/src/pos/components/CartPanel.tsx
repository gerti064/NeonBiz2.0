import { usePOS } from "../context/POSContext";
import { formatMoney } from "../utils";

const CURRENCY = "€";

export default function CartPanel() {
  const {
    cart,
    inc,
    dec,
    remove,
    total,
    paying,
    createNewOrder,
  } = usePOS();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="h-14 px-5 flex items-center border-b border-stone-200 font-semibold">
        Ticket
      </div>

      {/* ITEMS (SCROLL ONLY HERE) */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {cart.length === 0 ? (
          <div className="text-stone-500 text-sm text-center mt-6">
            No items added
          </div>
        ) : (
          cart.map((i) => (
            <div
              key={i.productId}
              className="flex justify-between items-start text-sm"
            >
              <div className="flex-1">
                <div className="font-medium truncate">{i.name}</div>
                <div className="text-stone-500">
                  {i.qty} × {formatMoney(i.price, CURRENCY)}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={() => dec(i.productId)}
                  className="w-7 h-7 rounded bg-stone-200 text-sm"
                >
                  −
                </button>
                <span className="w-4 text-center">{i.qty}</span>
                <button
                  onClick={() => inc(i.productId)}
                  className="w-7 h-7 rounded bg-stone-200 text-sm"
                >
                  +
                </button>
                <button
                  onClick={() => remove(i.productId)}
                  className="text-stone-400 hover:text-stone-700 ml-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER (ALWAYS VISIBLE) */}
      <div className="border-t border-stone-200 px-5 py-4 space-y-3">
        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>{formatMoney(total, CURRENCY)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="bg-stone-200 py-3 rounded-lg font-semibold">
            Save
          </button>

          <button
            onClick={() => createNewOrder("cash")}
            disabled={paying || cart.length === 0}
            className="
              bg-emerald-500 text-white py-3 rounded-lg font-semibold
              hover:bg-emerald-600 transition
              disabled:opacity-50
            "
          >
            Charge
          </button>
        </div>
      </div>
    </div>
  );
}
