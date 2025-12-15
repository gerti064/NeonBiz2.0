export type CategoryKey = "coffee" | "tea" | "snack";

export type Product = {
  id: string;
  name: string;
  category: CategoryKey;
  price: number;
  available: boolean;
  imageUrl?: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type CreateOrderPayload = {
  customerName: string;
  items: {
    productId: string;
    qty: number;
    unitPrice: number;
    name: string;
  }[];
  note?: string;
  paymentMethod?: "cash" | "card";
};
