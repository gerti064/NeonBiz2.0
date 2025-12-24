export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  createdAt: string;
  customerName: string;
  paymentMethod: "cash" | "card";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
};
