import { USERNAME, PASSWORD } from '../../lib/secrets';
import type { APIRoute } from 'astro';

export const prerender = false;


export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get('username')?.toString() ?? '';
  const password = formData.get('password')?.toString() ?? '';

  if (username !== USERNAME || password !== PASSWORD) {
    return new Response("Invalid credentials", { status: 401 });
  }

  // ✅ TODO: set session/cookie/token
  return Response.redirect(new URL("/dashboard", request.url), 302);

};
