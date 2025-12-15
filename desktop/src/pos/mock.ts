import type { Product } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Espresso", category: "coffee", price: 4.2, available: true, imageUrl: "/pos/espresso.jpg" },
  { id: "p2", name: "Cappuccino", category: "coffee", price: 3.1, available: true, imageUrl: "/pos/cappuccino.jpg" },
  { id: "p3", name: "Latte", category: "coffee", price: 4.0, available: true, imageUrl: "/pos/latte.jpg" },
  { id: "p4", name: "Americano", category: "coffee", price: 4.0, available: true, imageUrl: "/pos/americano.jpg" },
  { id: "p5", name: "Mocha", category: "coffee", price: 4.0, available: true, imageUrl: "/pos/mocha.jpg" },
  { id: "p6", name: "Iced Coffee Milk", category: "coffee", price: 3.0, available: true, imageUrl: "/pos/iced-coffee.jpg" },

  { id: "t1", name: "Green Tea", category: "tea", price: 2.5, available: true, imageUrl: "/pos/tea.jpg" },
  { id: "t2", name: "Black Tea", category: "tea", price: 2.3, available: true, imageUrl: "/pos/tea2.jpg" },
  { id: "t3", name: "Chamomile", category: "tea", price: 2.7, available: false, imageUrl: "/pos/tea3.jpg" },

  { id: "s1", name: "Croissant", category: "snack", price: 2.2, available: true, imageUrl: "/pos/snack.jpg" },
  { id: "s2", name: "Muffin", category: "snack", price: 2.4, available: true, imageUrl: "/pos/snack2.jpg" },
  { id: "s3", name: "Cookie", category: "snack", price: 1.6, available: false, imageUrl: "/pos/snack3.jpg" },
];
