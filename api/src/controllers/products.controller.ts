import type { Request, Response } from "express";
import { pool } from "../config/db";

export async function listProducts(_req: Request, res: Response) {
  try {
    const r = await pool.query(`
      SELECT
        id,
        name,
        category,
        price,
        available,
        image_url AS "imageUrl"
      FROM products
      ORDER BY id DESC
      LIMIT 500
    `);

    res.json({ ok: true, items: r.rows });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
