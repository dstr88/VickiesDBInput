// src/lib/db.ts
import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import dotenv from 'dotenv';

// Load the correct .env file based on environment
const envPath = process.env.NODE_ENV?.trim() === 'production'
  ? '.env.production'
  : '.env.development';

console.log('📦 Loading env from:', envPath);
dotenv.config({ path: envPath });

export const ALLOW_DB_ACCESS = process.env.ALLOW_DB_ACCESS === 'true';
const useSQLite = process.env.USE_SQLITE === 'true';

let sqliteDb: Database | null = null;
let mysqlPool: mysql.Pool | null = null;

if (useSQLite) {
  console.log('🪵 Using SQLite for local development/builds');
  const dbPath = process.env.SQLITE_DB_PATH || './data/dev.sqlite';

  const openSQLite = async () => {
    sqliteDb = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    console.log(`🗃️ Connected to SQLite at ${dbPath}`);
  };

  await openSQLite();
} else {
  console.log('🌐 Using MySQL for production');

  const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
  } = process.env;

  if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('❌ Missing required database environment variables.');
  }

  mysqlPool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT) || 3306,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30_000, // 30 seconds
  });

  console.log(`🔗 Connected to MySQL at ${DB_HOST}:${DB_PORT}`);
}

// ✅ Unified DB wrapper (API-compatible)
export const db = {
  async all(sql: string, params: any[] = []) {
    if (sqliteDb) return sqliteDb.all(sql, params);
    const [rows] = await mysqlPool!.query(sql, params);
    return rows;
  },
  async get(sql: string, params: any[] = []) {
    if (sqliteDb) return sqliteDb.get(sql, params);
    const [rows] = await mysqlPool!.query(sql, params);
    return Array.isArray(rows) ? rows[0] : rows;
  },
  async run(sql: string, params: any[] = []) {
    if (sqliteDb) return sqliteDb.run(sql, params);
    const [result] = await mysqlPool!.execute(sql, params);
    return result;
  }
};
