// src/pages/api/signup.ts
import type { APIRoute } from 'astro';
// import { db } from '../../lib/db'; // ⬅️ Optional: enable if saving to DB
// import bcrypt from 'bcryptjs'; // ⬅️ Optional: enable if you want to hash passwords

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();
  const confirm = formData.get('confirm')?.toString();

  if (!email || !password || !confirm) {
    return new Response("❌ All fields are required.", { status: 400 });
  }

  if (password !== confirm) {
    return new Response("❌ Passwords do not match.", { status: 400 });
  }

  if (password.length < 6) {
    return new Response("❌ Password must be at least 6 characters.", { status: 400 });
  }

  // Optional: check if user exists
  /*
  const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (existing) {
    return new Response("❌ User already exists.", { status: 400 });
  }
  */

  // Optional: hash password before storing
  /*
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
  */

  console.log("✅ New user registered:", { email /*, password: hashedPassword */ });

  return new Response("✅ Signup successful!", { status: 200 });
};
