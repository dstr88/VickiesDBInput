// src/pages/api/posts.ts
import type { APIRoute } from 'astro';
import { db } from '../../lib/db';

export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const title = formData.get('title')?.toString() || '';
    const slug = formData.get('slug')?.toString() || '';
    const summary = formData.get('summary')?.toString() || '';
    const content = formData.get('content')?.toString() || '';
    const isPrivate = formData.get('isPrivate') === 'on';

    console.log("📥 Incoming form data:", {
      title, slug, summary, content, isPrivate
    });

    if (!title || !slug || !content) {
      return new Response("Missing required fields", { status: 400 });
    }

    await db.run(
      `INSERT INTO posts (title, slug, summary, content, isPrivate, createdAt, views)
       VALUES (?, ?, ?, ?, ?, datetime('now'), 0)`,
      [title, slug, summary, content, isPrivate ? 1 : 0]
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard?saved=post',
      },
    });
  } catch (err) {
    console.error('❌ POST /api/posts error:', err);

    try {
      const debugForm = await request.formData();
      console.log("📦 DEBUG fallback form data:", {
        title: debugForm.get('title'),
        slug: debugForm.get('slug'),
        summary: debugForm.get('summary'),
        content: debugForm.get('content'),
        isPrivate: debugForm.get('isPrivate')
      });
    } catch (innerErr) {
      console.error("❌ Even fallback formData() failed:", innerErr);
    }

    return new Response("Internal Server Error", { status: 500 });
  }
};
