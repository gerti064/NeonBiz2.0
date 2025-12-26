export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  isActive: boolean;
  createdAt: string;
};

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function fetchProducts(
  activeOnly = true
): Promise<Product[]> {
  const url = new URL(`${BASE_URL}/api/products`);

  // backend supports ?active=1 (default). active=0 shows all
  if (!activeOnly) url.searchParams.set("active", "0");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`);
  }

  const data = await res.json();
  const items = (data.items || []) as any[];

  // ✅ Normalize backend data for frontend safety
  return items.map((p) => ({
    ...p,
    category: p.category?.toLowerCase(), // "Snack" → "snack"
    price: Number(p.price ?? 0),          // "1.60" → 1.6
    cost: Number(p.cost ?? 0),
  }));
}
