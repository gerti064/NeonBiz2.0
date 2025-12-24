import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, CategoryKey, Product } from "../types";
import { calcSubtotal, calcTax } from "../utils";
import { getProducts, getOrdersCountToday, createOrder as apiCreateOrder } from "../api";

const TAX_RATE = 0.0;

export type POSOrderItem = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
};

export type POSOrder = {
  id: string;
  createdAt: string; // ISO
  customerName: string;
  paymentMethod: "cash" | "card";
  items: POSOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
};

type POSContextType = {
  loading: boolean;

  products: Product[];
  tab: CategoryKey;
  setTab: (v: CategoryKey) => void;

  customerName: string;
  setCustomerName: (v: string) => void;

  cart: CartItem[];
  addToCart: (p: Product) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clearCart: () => void;

  subtotal: number;
  tax: number;
  total: number;

  orders: POSOrder[];
  ordersCountToday: number;
  paying: boolean;
  createNewOrder: (paymentMethod?: "cash" | "card") => Promise<void>;

  toast: string | null;
  setToast: (v: string | null) => void;
};

const POSContext = createContext<POSContextType | undefined>(undefined);

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<CategoryKey>("coffee");

  const [customerName, setCustomerName] = useState("Customer");
  const [cart, setCart] = useState<CartItem[]>([]);

  const [orders, setOrders] = useState<POSOrder[]>([]);
  const [ordersCountToday, setOrdersCountToday] = useState<number>(0);

  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, count] = await Promise.all([getProducts(), getOrdersCountToday()]);
        setProducts(p);
        setOrdersCountToday(count);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const subtotal = useMemo(() => calcSubtotal(cart), [cart]);
  const tax = useMemo(() => calcTax(subtotal, TAX_RATE), [subtotal]);
  const total = subtotal + tax;

  function addToCart(p: Product) {
    if (!p.available) {
      setToast("Item not available");
      return;
    }

    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { productId: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  }

  function inc(id: string) {
    setCart((prev) => prev.map((i) => (i.productId === id ? { ...i, qty: i.qty + 1 } : i)));
  }

  function dec(id: string) {
    setCart((prev) =>
      prev
        .map((i) => (i.productId === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function remove(id: string) {
    setCart((prev) => prev.filter((i) => i.productId !== id));
  }

  function clearCart() {
    setCart([]);
  }

  async function createNewOrder(paymentMethod: "cash" | "card" = "cash") {
    if (!cart.length) {
      setToast("Cart is empty");
      return;
    }

    setPaying(true);
    try {
      const payload = {
        customerName,
        items: cart.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          unitPrice: i.price,
          name: i.name,
        })),
        paymentMethod,
      };

      // call your backend (kept the same signature you used before)
      await apiCreateOrder(payload);

      // keep a local order record so Orders/Statistics pages work instantly
      const localOrder: POSOrder = {
        id: uid(),
        createdAt: new Date().toISOString(),
        customerName,
        paymentMethod,
        items: payload.items,
        subtotal,
        tax,
        total,
      };

      setOrders((prev) => [localOrder, ...prev]);
      setOrdersCountToday((c) => c + 1);
      setCart([]);
      setToast("Order created");
    } catch {
      setToast("Failed to create order");
    } finally {
      setPaying(false);
    }
  }

  const value: POSContextType = {
    loading,
    products,
    tab,
    setTab,
    customerName,
    setCustomerName,
    cart,
    addToCart,
    inc,
    dec,
    remove,
    clearCart,
    subtotal,
    tax,
    total,
    orders,
    ordersCountToday,
    paying,
    createNewOrder,
    toast,
    setToast,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
}

export function usePOS() {
  const ctx = useContext(POSContext);
  if (!ctx) throw new Error("usePOS must be used inside POSProvider");
  return ctx;
}
