import React, { useMemo, useState, useCallback } from "react";
import { usePOS } from "../context/POSContext";

type ViewMode = "list" | "details";

export default function TabsSidebar() {
  const { tabsPayLater, checkoutTab, cancelTab, paying } = usePOS();

  const openTabs = useMemo(
    () => tabsPayLater.filter((t) => t.status === "open"),
    [tabsPayLater]
  );

  // ✅ No auto-selected tab. Start in list view with nothing selected.
  const [view, setView] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return openTabs.find((t) => t.id === selectedId) || null;
  }, [openTabs, selectedId]);

  const fmtMKD = useCallback((value: number) => {
    try {
      return new Intl.NumberFormat("mk-MK", {
        style: "currency",
        currency: "MKD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `${Math.round(value)} ден.`;
    }
  }, []);

  const goDetails = useCallback((id: string) => {
    setSelectedId(id);
    setView("details");
  }, []);

  const goBack = useCallback(() => {
    setView("list");
    setSelectedId(null);
  }, []);

  const onCancel = useCallback(() => {
    if (!selected) return;
    cancelTab(selected.id);
    goBack();
  }, [selected, cancelTab, goBack]);

  const onCheckoutCash = useCallback(() => {
    if (!selected) return;
    checkoutTab(selected.id, "cash");
  }, [selected, checkoutTab]);

  const onCheckoutCard = useCallback(() => {
    if (!selected) return;
    checkoutTab(selected.id, "card");
  }, [selected, checkoutTab]);

  return (
    <div className="tabsSide">
      <div className="tabsSideHeader">
        <div className="tabsSideTitle">Отворени сметки</div>
        <div className="tabsSideCount">{openTabs.length}</div>
      </div>

      {view === "list" ? (
        <div className="tabsSideList">
          {openTabs.length === 0 ? (
            <div className="tabsEmpty">Нема отворени сметки</div>
          ) : (
            openTabs.map((t) => (
              <button
                key={t.id}
                className="tabPill"
                onClick={() => goDetails(t.id)}
                disabled={paying}
              >
                <div className="tabPillTop">
                  <span className="tabPillName">{t.customerName}</span>
                  <span className="tabPillTotal">{fmtMKD(t.total)}</span>
                </div>
                <div className="tabPillMeta">
                  <span>{t.items.length} производи</span>
                  <span>
                    {new Date(t.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="tabsSideDetails">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
            <button className="tabsBtnPrimary" onClick={goBack} disabled={paying} style={{ height: 36 }}>
              ← Назад
            </button>
            <div style={{ fontWeight: 900, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {selected?.customerName ?? "Сметка"}
            </div>
            <div style={{ fontWeight: 900, fontSize: 13 }}>
              {selected ? fmtMKD(selected.total) : ""}
            </div>
          </div>

          {!selected ? (
            <div className="tabsSelectedNone">Сметката не постои или е затворена.</div>
          ) : (
            <>
              <div className="tabsTableWrap">
                <table className="tabsTable">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Производ</th>
                      <th style={{ width: 52, textAlign: "center" }}>Кол.</th>
                      <th style={{ width: 86, textAlign: "right" }}>Цена</th>
                      <th style={{ width: 92, textAlign: "right" }}>Вкупно</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items.map((it) => (
                      <tr key={it.productId}>
                        <td className="tabsTdName">{it.name}</td>
                        <td style={{ textAlign: "center" }}>{it.qty}</td>
                        <td style={{ textAlign: "right" }}>{fmtMKD(it.unitPrice)}</td>
                        <td style={{ textAlign: "right" }}>{fmtMKD(it.qty * it.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ✅ Tax removed: show ONLY total */}
              <div className="tabsTotals">
                <div className="tabsTotRow strong" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
                  <span>Вкупно</span>
                  <span>{fmtMKD(selected.total)}</span>
                </div>
              </div>

              <div className="tabsFooterBtns">
                <button className="tabsBtnDanger" onClick={onCancel} disabled={paying}>
                  Откажи
                </button>
                <button className="tabsBtnPrimary" onClick={onCheckoutCash} disabled={paying}>
                  Наплата — кеш
                </button>
                <button className="tabsBtnPrimary" onClick={onCheckoutCard} disabled={paying}>
                  Наплата — картичка
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
