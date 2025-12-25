import { Request, Response } from "express";
import * as ProductsService from "../services/products.service";

export async function listProducts(req: Request, res: Response) {
  try {
    const products = await ProductsService.getProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load products" });
  }
}
