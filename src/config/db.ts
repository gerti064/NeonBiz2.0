import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "oxa_cafe",
  user: "oxa_cafe_user",
  password: process.env.DB_PASSWORD,
});
