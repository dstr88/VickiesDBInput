// src/pages/api/proverbs.ts
import type { APIRoute } from 'astro';
import { db } from '../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { text, source, slug, isPrivate } = await request.json();

    if (!text || !slug) {
      return new Response("Missing required fields", { status: 400 });
    }

    await db.run(
      `INSERT INTO proverb (text, source, slug, isPrivate)
       VALUES (?, ?, ?, ?)`,
      [text, source ?? '', slug, isPrivate ? 1 : 0]
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard?saved=proverb',
      },
    });
  } catch (err) {
    console.error("❌ Failed to save proverb:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
