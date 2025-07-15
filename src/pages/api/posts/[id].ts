// src/pages/api/posts/[id].ts
import type { APIRoute } from 'astro';
import { db } from '@/lib/db';

export const prerender = false;

// DELETE a post
export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return new Response("Missing ID", { status: 400 });

  try {
    await db.run(`DELETE FROM posts WHERE id = ?`, [id]);
    return new Response("✅ Post deleted", { status: 200 });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    return new Response("Error deleting post", { status: 500 });
  }
};

// PUT (full update) a post
export const PUT: APIRoute = async ({ request, params }) => {
  const id = params.id;
  if (!id) return new Response("Missing ID", { status: 400 });

  const data = await request.json();
  const { title, slug, summary, content, isPrivate } = data;

  if (!title || !slug || !content) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    await db.run(
      `UPDATE posts SET title = ?, slug = ?, summary = ?, content = ?, isPrivate = ? WHERE id = ?`,
      [title, slug, summary ?? '', content, isPrivate ? 1 : 0, id]
    );
    return new Response("✅ Post updated", { status: 200 });
  } catch (err) {
    console.error("❌ Update failed:", err);
    return new Response("Error updating post", { status: 500 });
  }
};

// PATCH (partial update) - privacy toggle
export const PATCH: APIRoute = async ({ request, params }) => {
  const id = params.id;
  if (!id) return new Response("Missing ID", { status: 400 });

  try {
    const { isPrivate } = await request.json();

    await db.run(
      `UPDATE posts SET isPrivate = ? WHERE id = ?`,
      [isPrivate ? 1 : 0, id]
    );

    return new Response("✅ Privacy updated", { status: 200 });
  } catch (err) {
    console.error("❌ Privacy update failed:", err);
    return new Response("Error updating privacy", { status: 500 });
  }
};
