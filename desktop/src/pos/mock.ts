import type { Product } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Espresso",
    category: "coffee",
    price: 4.2,
    available: true,
    imageUrl: "/espresso.webp",
  },
  {
    id: "p2",
    name: "Cappuccino",
    category: "coffee",
    price: 3.1,
    available: true,
    imageUrl: "/cappuccino.png",
  },
  {
    id: "p3",
    name: "Latte",
    category: "coffee",
    price: 4.0,
    available: true,
    imageUrl: "/latte.jpg",
  },
  {
    id: "p4",
    name: "Americano",
    category: "coffee",
    price: 4.0,
    available: true,
    imageUrl: "/americano.jpg",
  },
  {
    id: "p5",
    name: "Mocha",
    category: "coffee",
    price: 4.0,
    available: true,
    imageUrl: "/mocha.jpg",
  },
  {
    id: "p6",
    name: "Iced Coffee Milk",
    category: "coffee",
    price: 3.0,
    available: true,
    imageUrl: "/iced-coffe.jpg",
  },
];
