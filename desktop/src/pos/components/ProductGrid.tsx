import type { Product } from "../types";
import { formatMoney } from "../utils";

const CURRENCY = "$";

export default function ProductGrid({
  products,
  loading,
  onAdd,
}: {
  products: Product[];
  loading: boolean;
  onAdd: (p: Product) => void;
}) {
  if (loading) return <div className="posBlock">Loading...</div>;

  return (
    <div className="productGrid">
      {products.map((p) => (
        <div
          key={p.id}
          className={`productCard ${!p.available ? "productDisabled" : ""}`}
        >
          <div className={`chip ${p.available ? "chipOk" : "chipBad"}`}>
            {p.available ? "Available" : "Need to stock"}
          </div>

          <div className="productImg">
            {p.imageUrl ? <img src={p.imageUrl} /> : <div className="imgFallback">{p.name[0]?.toUpperCase()}</div>}
          </div>

          <div className="productInfo">
            <div className="productName">{p.name}</div>
            <div className="productPrice">{formatMoney(p.price, CURRENCY)}</div>
          </div>

          <button className="addBtn" onClick={() => onAdd(p)} disabled={!p.available}>
            +
          </button>
        </div>
      ))}
    </div>
  );
}
