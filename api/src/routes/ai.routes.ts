// api/src/routes/ai.routes.ts
import { Router } from "express";
import OpenAI from "openai";
import { Pool } from "pg";

const router = Router();

/* =========================
   Clients
   ========================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const TZ = process.env.AI_TIMEZONE || "Europe/Skopje";

/* =========================
   DB TOOLS
   ========================= */
async function getOrdersCountToday() {
  const sql = `
    SELECT COUNT(*)::int AS orders_count
    FROM public.orders o
    WHERE (o.created_at AT TIME ZONE $1)::date = (NOW() AT TIME ZONE $1)::date
      AND o.status ILIKE 'complete%'
  `;
  const { rows } = await pool.query(sql, [TZ]);
  return { date: "today", timezone: TZ, ordersCount: rows[0]?.orders_count ?? 0 };
}

async function getRevenueToday() {
  const sql = `
    SELECT COALESCE(SUM(o.total_amount), 0)::numeric(10,2) AS revenue
    FROM public.orders o
    WHERE (o.created_at AT TIME ZONE $1)::date = (NOW() AT TIME ZONE $1)::date
      AND o.status ILIKE 'complete%'
  `;
  const { rows } = await pool.query(sql, [TZ]);
  return { date: "today", timezone: TZ, revenue: rows[0]?.revenue ?? "0.00" };
}

async function getCoffeeSoldToday() {
  const sql = `
    SELECT COALESCE(SUM(oi.quantity), 0)::int AS coffees_sold
    FROM public.orders o
    JOIN public.order_items oi ON oi.order_id = o.id
    JOIN public.products p ON p.id = oi.product_id
    WHERE (o.created_at AT TIME ZONE $1)::date = (NOW() AT TIME ZONE $1)::date
      AND o.status ILIKE 'complete%'
      AND p.category ILIKE 'coffee'
  `;
  const { rows } = await pool.query(sql, [TZ]);
  return { date: "today", timezone: TZ, coffeesSold: rows[0]?.coffees_sold ?? 0 };
}

async function listProductsByCategory(category: string) {
  const sql = `
    SELECT id, name, category, price, is_active
    FROM public.products
    WHERE category ILIKE $1
    ORDER BY name ASC
  `;
  const { rows } = await pool.query(sql, [category]);
  return { category, count: rows.length, products: rows };
}

/* =========================
   TOOL SCHEMAS
   ========================= */
const tools = [
  {
    type: "function",
    function: {
      name: "get_coffee_sold_today",
      description: "Returns how many coffee units were sold today.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_revenue_today",
      description: "Returns total revenue today (completed orders only).",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_orders_count_today",
      description: "Returns number of completed orders today.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "list_products_by_category",
      description: "Lists products for a given category (e.g. Coffee, Tea, Pastry).",
      parameters: {
        type: "object",
        properties: { category: { type: "string" } },
        required: ["category"],
      },
    },
  },
] as const;

/* =========================
   ROUTE
   ========================= */
router.post("/ask", async (req, res) => {
  try {
    const question = String(req.body?.question ?? "").trim();
    if (!question) return res.status(400).json({ error: "Missing question" });

    const messages: any[] = [
      {
        role: "system",
        content:
          "You are a POS statistics assistant. Use tools to fetch live numbers. Never invent numbers. If data is insufficient, say so.",
      },
      { role: "user", content: question },
    ];

    let guard = 0;

    while (guard < 5) {
      guard++;

      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        tools: tools as any,
        tool_choice: "auto",
      });

      const msg = resp.choices[0]?.message;

      // No tools requested → final answer
      if (!msg || !("tool_calls" in msg) || !msg.tool_calls?.length) {
        return res.json({ answer: msg?.content || "" });
      }

      // Push assistant message with tool calls
      messages.push({
        role: "assistant",
        content: msg.content ?? "",
        tool_calls: msg.tool_calls,
      });

      // IMPORTANT: fully control typing here (no TS red lines)
      const toolCalls = (msg.tool_calls ?? []) as Array<{
        id: string;
        function: { name: string; arguments?: string };
      }>;

      for (const tc of toolCalls) {
        const { name, arguments: argStr } = tc.function;

        const args =
          typeof argStr === "string" && argStr.length ? JSON.parse(argStr) : {};

        let result: any;

        if (name === "get_coffee_sold_today") {
          result = await getCoffeeSoldToday();
        } else if (name === "get_revenue_today") {
          result = await getRevenueToday();
        } else if (name === "get_orders_count_today") {
          result = await getOrdersCountToday();
        } else if (name === "list_products_by_category") {
          result = await listProductsByCategory(String((args as any).category || ""));
        } else {
          result = { error: `Unknown tool: ${name}` };
        }

        messages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: JSON.stringify(result),
        });
      }
    }

    return res.json({ answer: "Unable to complete the request." });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "AI error" });
  }
});

export default router;
