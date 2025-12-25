import { pool } from "../config/db";

export async function getProducts() {
  const { rows } = await pool.query(
    `
    SELECT id, name, price, category
    FROM products
    WHERE is_active = true
    ORDER BY category, name
    `
  );
  return rows;
}
