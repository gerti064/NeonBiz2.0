import { useMemo } from "react";
import { usePOS } from "../context/POSContext";
import { formatMoney } from "../utils";

const CURRENCY = "€";

export default function TabsSidebar() {
  const { tabsPayLater } = usePOS();

  const openTabs = useMemo(
    () => tabsPayLater.filter((t) => t.status === "open"),
    [tabsPayLater]
  );

  return (
    <div className="h-full w-full bg-white flex flex-col border-r border-stone-200">
      {/* HEADER */}
      <div className="h-14 flex items-center justify-center border-b border-stone-200 font-semibold">
        Tabs
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {openTabs.length === 0 ? (
          <div className="text-xs text-stone-500 text-center mt-4">
            No open tabs
          </div>
        ) : (
          openTabs.map((t) => (
            <button
              key={t.id}
              className="w-full text-left bg-stone-100 hover:bg-stone-200 rounded-lg p-3 transition"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">
                  {t.customerName}
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  {formatMoney(t.total, CURRENCY)}
                </span>
              </div>

              <div className="text-xs text-stone-500 mt-1">
                {t.items.length} items
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
