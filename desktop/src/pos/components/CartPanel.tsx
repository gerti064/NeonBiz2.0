import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePOS } from "../context/POSContext";
import { formatMoney } from "../utils";
import TabsSidebar from "./TabsSidebar";

const CURRENCY = "€";

export default function CartPanel() {
  const navigate = useNavigate();

  const {
    cart,
    inc,
    dec,
    remove,
    total,
    paying,
    createNewOrder,
    orders, // IMPORTANT: we need orders to detect when a new order is created
  } = usePOS();

  // Track redirect intent + previous orders length
  const shouldRedirectRef = useRef(false);
  const prevOrdersLenRef = useRef<number>(orders.length);

  useEffect(() => {
    const prevLen = prevOrdersLenRef.current;
    const currentLen = orders.length;

    // If we pressed Charge and orders increased -> go to /orders
    if (shouldRedirectRef.current && currentLen > prevLen) {
      shouldRedirectRef.current = false;
      navigate("/orders");
    }

    prevOrdersLenRef.current = currentLen;
  }, [orders.length, navigate]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* HEADER */}
      <div className="h-14 px-5 flex items-center justify-between border-b border-stone-200">
        <div className="font-semibold">Ticket</div>
        <div className="text-xs text-stone-500">
          {cart.length ? `${cart.length} items` : ""}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* TICKET ITEMS */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="text-stone-500 text-sm text-center mt-10">
              No items added
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((i) => (
                <div
                  key={i.productId}
                  className="rounded-2xl border border-stone-200 p-3 hover:border-stone-300 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {i.name}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {formatMoney(i.price, CURRENCY)} each
                      </div>
                    </div>

                    <button
                      onClick={() => remove(i.productId)}
                      className="text-stone-400 hover:text-stone-700"
                      aria-label="Remove item"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-stone-700">
                      {i.qty} × {formatMoney(i.price, CURRENCY)}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dec(i.productId)}
                        className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 transition font-black"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-semibold">
                        {i.qty}
                      </span>
                      <button
                        onClick={() => inc(i.productId)}
                        className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 transition font-black"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-stone-200 px-5 py-4 space-y-3">
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{formatMoney(total, CURRENCY)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              className="bg-stone-200 hover:bg-stone-300 transition py-3 rounded-2xl font-semibold"
              disabled={!cart.length}
              onClick={() => {
                // optional: save to tab logic
              }}
            >
              Save
            </button>

            <button
              onClick={() => {
                if (paying || cart.length === 0) return;

                // mark that we want to redirect once the order is actually created
                shouldRedirectRef.current = true;

                // trigger order creation
                createNewOrder("cash");
              }}
              disabled={paying || cart.length === 0}
              className="
                bg-emerald-600 text-white py-3 rounded-2xl font-semibold
                hover:bg-emerald-700 transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {paying ? "Creating..." : "Charge"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="w-full py-2 rounded-2xl text-sm font-semibold text-emerald-800 hover:bg-emerald-50 transition"
          >
            View Orders
          </button>
        </div>

        {/* TABS SECTION */}
        <div className="border-t border-stone-200 bg-stone-50">
          <div className="max-h-[320px] overflow-y-auto">
            <TabsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
