import type { Product } from "../types";
import { formatMoney } from "../utils";

const CURRENCY = "€";

export default function ProductGrid({
  products,
  loading,
  onAdd,
}: {
  products: Product[];
  loading: boolean;
  onAdd: (p: Product) => void;
}) {
  if (loading) return <div>Loading…</div>;

  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((p) => (
        <button
          key={p.id}
          onClick={() => onAdd(p)}
          disabled={!p.available}
          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition text-left"
        >
          {/* IMAGE */}
          <div className="h-32 bg-stone-200">
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* INFO */}
          <div className="p-3">
            <div className="font-semibold text-sm truncate">
              {p.name}
            </div>
            <div className="text-xs text-stone-500">
              Freshly prepared
            </div>

            <div className="mt-2 font-bold text-emerald-600">
              {formatMoney(p.price, CURRENCY)}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
