import { Router } from "express";
import { pool } from "../config/db";

const router = Router();

// GET /api/health
router.get("/", (_req, res) => {
  res.json({ ok: true });
});

// GET /api/health/db
router.get("/db", async (_req, res) => {
  try {
    const r = await pool.query("SELECT 1 AS ok");
    res.json({ ok: true, db: true, result: r.rows[0] });
  } catch (e: any) {
    res.status(500).json({
      ok: false,
      db: false,
      error: e.message,
    });
  }
});

export default router;
