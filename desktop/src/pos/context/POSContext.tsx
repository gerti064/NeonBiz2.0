import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, CategoryKey, Product } from "../types";
import { calcSubtotal, calcTax } from "../utils";
import {
  getProducts,
  getOrdersCountToday,
  createOrder as apiCreateOrder,
} from "../api";

const TAX_RATE = 0.0;

/* ---------------- TYPES ---------------- */

export type POSOrderItem = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
};

export type POSOrder = {
  id: string;
  createdAt: string;
  customerName: string;
  paymentMethod: "cash" | "card";
  items: POSOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
};

export type POSTabStatus = "open" | "paid" | "cancelled";

export type POSTab = {
  id: string;
  createdAt: string;
  customerName: string;
  items: POSOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: POSTabStatus;
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

  checkoutMode: "payNow" | "tab";
  setCheckoutMode: (v: "payNow" | "tab") => void;

  tabNameDraft: string;
  setTabNameDraft: (v: string) => void;

  completeCart: (paymentMethod?: "cash" | "card") => Promise<void>;

  tabsPayLater: POSTab[];
  tabsSidebarOpen: boolean;
  setTabsSidebarOpen: (v: boolean) => void;

  checkoutTab: (
    tabId: string,
    paymentMethod?: "cash" | "card"
  ) => Promise<void>;
  cancelTab: (tabId: string) => void;

  toast: string | null;
  setToast: (v: string | null) => void;
};

const POSContext = createContext<POSContextType | undefined>(undefined);

/* ---------------- HELPERS ---------------- */

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* ---------------- PROVIDER ---------------- */

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

  const [checkoutMode, setCheckoutMode] = useState<"payNow" | "tab">("payNow");
  const [tabNameDraft, setTabNameDraft] = useState("");

  const [tabsPayLater, setTabsPayLater] = useState<POSTab[]>([]);
  const [tabsSidebarOpen, setTabsSidebarOpen] = useState(false);

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    (async () => {
      try {
        const [p, count] = await Promise.all([
          getProducts(),
          getOrdersCountToday(),
        ]);

        // ✅ NORMALIZE BACKEND DATA HERE
        const normalized: Product[] = p.map((prod: any) => ({
          ...prod,
          category: prod.category?.toLowerCase() as CategoryKey, // "Snack" → "snack"
          price: Number(prod.price), // "1.60" → 1.6
          available:
            prod.available !== undefined ? prod.available : true,
        }));

        setProducts(normalized);
        setOrdersCountToday(count);
      } catch (err) {
        console.error(err);
        setToast("Failed to load products");
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

  /* ---------------- TOTALS ---------------- */

  const subtotal = useMemo(() => calcSubtotal(cart), [cart]);
  const tax = useMemo(() => calcTax(subtotal, TAX_RATE), [subtotal]);
  const total = subtotal + tax;

  /* ---------------- CART ---------------- */

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
      return [
        ...prev,
        { productId: p.id, name: p.name, price: p.price, qty: 1 },
      ];
    });
  }

  function inc(id: string) {
    setCart((prev) =>
      prev.map((i) =>
        i.productId === id ? { ...i, qty: i.qty + 1 } : i
      )
    );
  }

  function dec(id: string) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === id ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );
  }

  function remove(id: string) {
    setCart((prev) => prev.filter((i) => i.productId !== id));
  }

  function clearCart() {
    setCart([]);
  }

  /* ---------------- PAY NOW ---------------- */

  async function createNewOrder(
    paymentMethod: "cash" | "card" = "cash"
  ) {
    if (!cart.length) {
      setToast("Cart is empty");
      return;
    }

    setPaying(true);
    try {
      await apiCreateOrder({
        paymentMethod,
        items: cart.map((i) => ({
          productId: i.productId,
          qty: i.qty,
        })),
      });

      const localItems: POSOrderItem[] = cart.map((i) => ({
        productId: i.productId,
        name: i.name,
        qty: i.qty,
        unitPrice: i.price,
      }));

      const localOrder: POSOrder = {
        id: uid(),
        createdAt: new Date().toISOString(),
        customerName,
        paymentMethod,
        items: localItems,
        subtotal,
        tax,
        total,
      };

      setOrders((prev) => [localOrder, ...prev]);
      setOrdersCountToday((c) => c + 1);
      setCart([]);
      setToast("Order created");
    } catch (err) {
      console.error(err);
      setToast("Failed to create order");
    } finally {
      setPaying(false);
    }
  }

  /* ---------------- PAY LATER (TABS) ---------------- */

  async function checkoutTab(
    tabId: string,
    paymentMethod: "cash" | "card" = "cash"
  ) {
    const t = tabsPayLater.find((x) => x.id === tabId);
    if (!t || t.status !== "open") return;

    setPaying(true);
    try {
      await apiCreateOrder({
        paymentMethod,
        items: t.items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
        })),
      });

      const localOrder: POSOrder = {
        id: uid(),
        createdAt: new Date().toISOString(),
        customerName: t.customerName,
        paymentMethod,
        items: t.items,
        subtotal: t.subtotal,
        tax: t.tax,
        total: t.total,
      };

      setOrders((prev) => [localOrder, ...prev]);
      setOrdersCountToday((c) => c + 1);

      setTabsPayLater((prev) =>
        prev.map((x) =>
          x.id === tabId ? { ...x, status: "paid" } : x
        )
      );

      setToast("Tab paid");
    } catch {
      setToast("Failed to pay tab");
    } finally {
      setPaying(false);
    }
  }

  function cancelTab(tabId: string) {
    setTabsPayLater((prev) =>
      prev.map((t) =>
        t.id === tabId ? { ...t, status: "cancelled" } : t
      )
    );
    setToast("Tab cancelled");
  }

  async function completeCart(
    paymentMethod: "cash" | "card" = "cash"
  ) {
    if (checkoutMode === "tab") return;
    await createNewOrder(paymentMethod);
  }

  /* ---------------- CONTEXT VALUE ---------------- */

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

    checkoutMode,
    setCheckoutMode,
    tabNameDraft,
    setTabNameDraft,
    completeCart,

    tabsPayLater,
    tabsSidebarOpen,
    setTabsSidebarOpen,

    checkoutTab,
    cancelTab,

    toast,
    setToast,
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export function usePOS() {
  const ctx = useContext(POSContext);
  if (!ctx)
    throw new Error("usePOS must be used inside POSProvider");
  return ctx;
}
