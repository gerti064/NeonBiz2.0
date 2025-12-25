import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes";
import productsRoutes from "./routes/products.routes";
import ordersRoutes from "./routes/orders.routes";
import aiRoutes from "./routes/ai.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/ai", aiRoutes);

export default app;
