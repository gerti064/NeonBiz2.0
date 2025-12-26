import React, { useMemo } from "react";
import { usePOS } from "../context/POSContext";
import { formatMoney } from "../utils";

const CURRENCY = "€";

export default function TabsSidebar() {
  const { tabsPayLater } = usePOS() as any;

  const openTabs = useMemo(
    () => (tabsPayLater ?? []).filter((t: any) => t.status === "open"),
    [tabsPayLater]
  );

  // Optional: if your context supports selecting a tab, we use it.
  const selectedTabId: string | null = (usePOS() as any).selectedTabId ?? null;
  const setSelectedTabId: ((id: string) => void) | undefined =
    (usePOS() as any).setSelectedTabId;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="text-sm font-semibold text-stone-900">Open Tabs</div>
        <div className="text-[11px] text-stone-500">
          {openTabs.length} active
        </div>
      </div>

      {/* List */}
      <div className="px-3 pb-4">
        {openTabs.length === 0 ? (
          <div className="text-xs text-stone-500 text-center py-6">
            No open tabs
          </div>
        ) : (
          <div className="space-y-2">
            {openTabs.map((t: any) => {
              const active = selectedTabId === t.id;

              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTabId?.(t.id)}
                  className={[
                    "w-full text-left rounded-2xl border p-3 transition",
                    "hover:shadow-sm",
                    active
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-white border-stone-200 hover:border-stone-300",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-stone-900 truncate">
                        {t.customerName}
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        {(t.items?.length ?? 0)} items
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-700">
                        {formatMoney(t.total ?? 0, CURRENCY)}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">
                        {active ? "Selected" : ""}
                      </div>
                    </div>
                  </div>

                  {/* Subtle progress bar style accent */}
                  <div className="mt-3 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          20 + (t.items?.length ?? 0) * 10
                        )}%`,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
