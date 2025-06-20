// create-post.ts
import { db } from '../../../lib/db';
export async function POST({ request }) {
  const data = await request.json();
  await db.query('INSERT INTO posts SET ?', [data]);
  return new Response(JSON.stringify({ success: true }));
}
