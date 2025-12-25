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
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Statistics</h1>
        <p className="text-sm text-gray-500">
          Demo stats for now (based on locally created orders)
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          label="Total revenue"
          value={formatMoney(stats.totalRevenue, CURRENCY)}
        />
        <StatCard
          label="Total orders"
          value={stats.totalOrders.toString()}
        />
        <StatCard
          label="Today (backend count)"
          value={stats.ordersCountToday.toString()}
        />
        <StatCard
          label="Avg order"
          value={formatMoney(stats.avgOrder, CURRENCY)}
        />
      </div>
    </div>
  );
}

/* --------- Small reusable card --------- */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-gray-900">
        {value}
      </div>
    </div>
  );
}
