import express from "express";
import cors from "cors";
import "./config/env";

import healthRoutes from "./routes/health.routes";
import productsRoutes from "./routes/products.routes";
import ordersRoutes from "./routes/orders.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

// Fallback (optional but useful)
app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Route not found" });
});

export default app;
