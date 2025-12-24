import { useMemo } from "react";
import { usePOS } from "../context/POSContext";
import { formatMoney } from "../utils";

const CURRENCY = "$";

export default function StatsPage() {
  const { orders, ordersCountToday } = usePOS();

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const avg = orders.length ? totalRevenue / orders.length : 0;

    return {
      totalRevenue,
      totalOrders: orders.length,
      ordersCountToday,
      avgOrder: avg,
    };
  }, [orders, ordersCountToday]);

  return (
    <div className="statsWrap">
      <div className="pageTitle">Statistics</div>
      <div className="pageSub">Demo stats for now (based on locally created orders)</div>

      <div className="statsGrid">
        <div className="statCard">
          <div className="statLabel">Total revenue</div>
          <div className="statValue">{formatMoney(stats.totalRevenue, CURRENCY)}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Total orders</div>
          <div className="statValue">{stats.totalOrders}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Today (backend count)</div>
          <div className="statValue">{stats.ordersCountToday}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Avg order</div>
          <div className="statValue">{formatMoney(stats.avgOrder, CURRENCY)}</div>
        </div>
      </div>
    </div>
  );
}
