// src/lib/db.ts
import mysql from 'mysql2/promise';
import 'dotenv/config'; // ✅ Loads from .env/.env.local

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT ?? 3306), // Optional but safe
  waitForConnections: true,
  connectionLimit: 10,
});
