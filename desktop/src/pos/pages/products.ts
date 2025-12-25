export type Product = {
  id: string;
  name: string;
  category: string;
  price: number; // numeric from PG comes as string sometimes; we'll coerce
  cost: number;
  isActive: boolean;
  createdAt: string;
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function fetchProducts(activeOnly = true): Promise<Product[]> {
  const url = new URL(`${BASE_URL}/api/products`);
  // backend supports ?active=1 (default). active=0 shows all
  if (!activeOnly) url.searchParams.set("active", "0");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);

  const data = await res.json();
  const items = (data.items || []) as any[];

  // Coerce numeric fields safely
  return items.map((p) => ({
    ...p,
    price: typeof p.price === "string" ? Number(p.price) : p.price,
    cost: typeof p.cost === "string" ? Number(p.cost) : p.cost,
  }));
}
