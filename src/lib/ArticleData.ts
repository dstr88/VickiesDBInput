// src/lib/ArticleData.ts
import 'dotenv/config'; // Load environment variables
import * as mysql from 'mysql2/promise';

// ✅ Confirm env vars are loaded
console.log("🌐 ENV CHECK:", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
});

/**
 * Represents a single blog post record.
 */
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  createdAt: string;
}

/**
 * Handles fetching blog post data from MySQL.
 */
export class ArticleData {
  private pool: mysql.Pool | null = null;

  constructor() {
    const {
      DB_HOST,
      DB_PORT,
      DB_USER,
      DB_PASSWORD,
      DB_NAME
    } = process.env;

    if (!DB_HOST || !DB_USER || DB_PASSWORD === undefined || !DB_NAME) {
      throw new Error('❌ Missing required database environment variables.');
    }

    this.pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT ?? 3306),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log("🧪 DB ENV Loaded:", {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        db: DB_NAME
      });
    }
  }

  /**
   * Fetch all blog posts sorted by creation date (newest first).
   */
  async getPosts(): Promise<BlogPost[] | null> {
    if (!this.pool) {
      console.error('❌ Database pool is not initialized.');
      return null;
    }

    try {
      const [rows] = await this.pool.query<mysql.RowDataPacket[]>(
        `SELECT id, title, slug, content, summary, createdAt
         FROM posts
         ORDER BY createdAt DESC`
      );
      return rows as BlogPost[];
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      return null;
    }
  }

  /**
   * Fetch a single blog post by slug.
   */
  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    if (!this.pool) return;

    try {
      const [rows] = await this.pool.query<mysql.RowDataPacket[]>(
        `SELECT id, title, slug, content, summary, createdAt
         FROM posts
         WHERE slug = ? LIMIT 1`,
        [slug]
      );
      return (rows as BlogPost[])[0];
    } catch (error) {
      console.error(`❌ Error fetching post with slug "${slug}":`, error);
      return undefined;
    }
  }

  /**
   * Gracefully close the pool.
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
