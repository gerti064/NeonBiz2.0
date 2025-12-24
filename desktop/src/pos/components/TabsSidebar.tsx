// src/components/TabsSidebar.tsx
import React, { useMemo, useState } from "react";
import { usePOS } from "../context/POSContext";

export default function TabsSidebar() {
  const { tabsPayLater, tabsSidebarOpen, setTabsSidebarOpen, checkoutTab, cancelTab, paying } =
    usePOS();

  // Only NOT completed (open) should be visible
  const openTabs = useMemo(() => tabsPayLater.filter((t) => t.status === "open"), [tabsPayLater]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => openTabs.find((t) => t.id === selectedId) || null, [
    openTabs,
    selectedId,
  ]);

  // If selected gets paid/cancelled and disappears, reset selection
  React.useEffect(() => {
    if (selectedId && !openTabs.some((t) => t.id === selectedId)) setSelectedId(null);
  }, [openTabs, selectedId]);

  return (
    <div className="tabsPopoverWrap">
      <button
        className="tabsLineToggle"
        onClick={() => setTabsSidebarOpen(!tabsSidebarOpen)}
        title="Open tabs"
      >
        Open Tabs <span className="tabsLineCount">({openTabs.length})</span>
      </button>

      {tabsSidebarOpen && (
        <>
          <div className="tabsPopoverPanel" role="dialog" aria-label="Open tabs panel">
            <div className="tabsInlineHeader">
              <div className="tabsSidebarTitle">Open Tabs</div>
              <button className="tabsSidebarClose" onClick={() => setTabsSidebarOpen(false)}>
                ✕
              </button>
            </div>

            <div className="tabsGrid">
              {openTabs.length === 0 ? (
                <div className="tabsEmpty">No open tabs</div>
              ) : (
                openTabs.map((t) => (
                  <button
                    key={t.id}
                    className={`tabCard ${t.id === selectedId ? "tabCardActive" : ""}`}
                    onClick={() => setSelectedId(t.id)}
                  >
                    <div className="tabCardTop">
                      <div className="tabCardName">{t.customerName}</div>
                      <div className="tabCardTotal">${t.total.toFixed(2)}</div>
                    </div>
                    <div className="tabCardBottom">
                      <div className="tabCardItems">{t.items.length} items</div>
                      <div className="tabCardTime">
                        {new Date(t.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="tabsSidebarFooter">
              {!selected ? (
                <div className="tabsSelectedNone">Select a tab to view items</div>
              ) : (
                <>
                  <div className="tabsSelectedInfo">
                    <div className="tabsSelectedLabel">Selected:</div>
                    <div className="tabsSelectedName">{selected.customerName}</div>
                  </div>

                  {/* TABLE VISUALIZATION */}
                  <div className="tabsTableWrap">
                    <table className="tabsTable">
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left" }}>Item</th>
                          <th style={{ width: 70 }}>Qty</th>
                          <th style={{ width: 90 }}>Price</th>
                          <th style={{ width: 90 }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.items.map((it) => (
                          <tr key={it.productId}>
                            <td className="tabsTdName">{it.name}</td>
                            <td style={{ textAlign: "center" }}>{it.qty}</td>
                            <td style={{ textAlign: "right" }}>${it.unitPrice.toFixed(2)}</td>
                            <td style={{ textAlign: "right" }}>
                              ${(it.qty * it.unitPrice).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="tabsTotals">
                    <div className="tabsTotRow">
                      <span>Subtotal</span>
                      <span>${selected.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="tabsTotRow">
                      <span>Tax</span>
                      <span>${selected.tax.toFixed(2)}</span>
                    </div>
                    <div className="tabsTotRow strong">
                      <span>Total</span>
                      <span>${selected.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="tabsFooterBtns">
                    <button
                      className="tabsBtnDanger"
                      onClick={() => cancelTab(selected.id)}
                      disabled={paying}
                    >
                      Cancel
                    </button>

                    <button
                      className="tabsBtnPrimary"
                      onClick={() => checkoutTab(selected.id, "cash")}
                      disabled={paying}
                    >
                      Checkout (cash)
                    </button>

                    <button
                      className="tabsBtnPrimary"
                      onClick={() => checkoutTab(selected.id, "card")}
                      disabled={paying}
                    >
                      Checkout (card)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* click outside to close */}
          <div className="tabsPopoverBackdrop" onClick={() => setTabsSidebarOpen(false)} />
        </>
      )}
    </div>
  );
}
