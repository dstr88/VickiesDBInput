// inside src/lib/ArticleData.ts
import type { Post } from '../types/posts';
import type { BlogPost } from '../types/BlogPost';
import { db } from './db';

function allowDb(): boolean {
  return import.meta.env?.ALLOW_DB_ACCESS === "true";
}

export class ArticleData {
  async getAllPosts(): Promise<Post[]> {
    if (!allowDb()) {
      console.warn("⛔️ Skipping DB fetch for all posts due to env restrictions");
      return [];
    }

    try {
      const rows = await db.all(`
        SELECT id, title, slug, content, summary, createdAt, isPrivate, views
        FROM posts
        ORDER BY createdAt DESC
      `) as Post[];

      return rows.map((row) => ({
        ...row,
        isPrivate: Boolean(Number(row.isPrivate)),
        views: row.views ?? 0
      }));
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      return [];
    }
  }

  async getPublicPosts(): Promise<BlogPost[]> {
    if (!allowDb()) {
      console.warn("⛔️ Skipping DB fetch for public posts due to env restrictions");
      return [];
    }

    try {
      const rows = await db.all(`
        SELECT id, title, slug, content, summary, createdAt, isPrivate, views
        FROM posts
        WHERE isPrivate = 0
        ORDER BY createdAt DESC
      `) as BlogPost[];

      return rows.map((row) => ({
        ...row,
        isPrivate: Boolean(Number(row.isPrivate)),
        views: row.views ?? 0
      }));
    } catch (error) {
      console.error('❌ Error fetching public posts:', error);
      return [];
    }
  }

  async getPostBySlugAllowingPrivate(slug: string): Promise<BlogPost | null> {
    if (!allowDb()) return null;

    try {
      const post = await db.get(
        `SELECT id, title, slug, summary, content, isPrivate, createdAt, views
         FROM posts
         WHERE slug = ?
         LIMIT 1`,
        [slug]
      );

      return post ? {
        ...post,
        isPrivate: Boolean(post.isPrivate),
        views: post.views ?? 0
      } : null;
    } catch (error) {
      console.error(`❌ Error fetching post (even private) by slug "${slug}":`, error);
      return null;
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!allowDb()) {
      console.warn(`⛔️ Skipping DB fetch for slug "${slug}" due to env restrictions`);
      return null;
    }

    try {
      const post = await db.get(`
        SELECT id, title, slug, content, summary, createdAt, isPrivate, views
        FROM posts
        WHERE slug = ? AND isPrivate = 0
        LIMIT 1
      `, [slug]) as BlogPost | undefined;

      return post
        ? { ...post, isPrivate: Boolean(Number(post.isPrivate)), views: post.views ?? 0 }
        : null;
    } catch (error) {
      console.error(`❌ Error fetching post by slug "${slug}":`, error);
      return null;
    }
  }
}
