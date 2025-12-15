import type { CreateOrderPayload, Product } from "./types";
import { MOCK_PRODUCTS } from "./mock";

const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL || "http://localhost:4000/api";

const USE_MOCK =
  ((import.meta as any)?.env?.VITE_USE_MOCK ?? "true").toString() === "true";

async function jfetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Failed: ${path}`);
  }
  return data as T;
}

export async function getProducts(): Promise<Product[]> {
  if (USE_MOCK) return MOCK_PRODUCTS;

  const data = await jfetch<any>("/products");
  return Array.isArray(data) ? data : data.items ?? [];
}

export async function createOrder(payload: CreateOrderPayload): Promise<any> {
  if (USE_MOCK) return { id: `mock_${Date.now()}`, ok: true };

  return jfetch<any>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOrdersCountToday(): Promise<number> {
  if (USE_MOCK) return 30;
  try {
    const data = await jfetch<any>("/reports/orders-count?range=today");
    return data.count ?? 0;
  } catch {
    return 0;
  }
}
