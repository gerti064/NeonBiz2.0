import express from "express";
import cors from "cors";
import "./config/env";

import productsRoutes from "./routes/products.routes";
import ordersRoutes from "./routes/orders.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

export default app;
