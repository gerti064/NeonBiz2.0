import { pool } from "../config/db";

type OrderItem = {
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
};

export async function createOrder(
  items: OrderItem[],
  payment_method: string
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const total = items.reduce(
      (sum, i) => sum + i.unit_price * i.quantity,
      0
    );

    const orderRes = await client.query(
      `
      INSERT INTO orders (total_amount, payment_method)
      VALUES ($1, $2)
      RETURNING id
      `,
      [total, payment_method]
    );

    const orderId = orderRes.rows[0].id;

    for (const item of items) {
      await client.query(
        `
        INSERT INTO order_items
          (order_id, product_id, product_name, unit_price, quantity)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          orderId,
          item.product_id,
          item.product_name,
          item.unit_price,
          item.quantity,
        ]
      );
    }

    await client.query("COMMIT");
    return orderId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
