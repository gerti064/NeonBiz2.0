import { Request, Response } from "express";
import * as OrdersService from "../services/orders.service";

export async function createOrder(req: Request, res: Response) {
  try {
    const { items, payment_method } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items" });
    }

    const orderId = await OrdersService.createOrder(
      items,
      payment_method || "cash"
    );

    res.json({ success: true, order_id: orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
}
