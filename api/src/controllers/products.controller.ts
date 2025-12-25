import type { Request, Response } from "express";
import { pool } from "../config/db";

export async function listProducts(req: Request, res: Response) {
  try {
    // Optional: /api/products?active=1 (default active only)
    const activeParam = String(req.query.active ?? "1");
    const onlyActive = activeParam !== "0" && activeParam !== "false";

    const r = await pool.query(
      `
      SELECT
        id,
        name,
        category,
        price,
        cost,
        is_active AS "isActive",
        created_at AS "createdAt"
      FROM public.products
      WHERE ($1::boolean IS FALSE) OR (is_active = TRUE)
      ORDER BY created_at DESC
      LIMIT 500
      `,
      [onlyActive]
    );

    res.json({ ok: true, items: r.rows });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
