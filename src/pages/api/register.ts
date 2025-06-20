import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import 'dotenv/config';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const username = formData.get('username')?.toString() ?? '';
  const password = formData.get('password')?.toString() ?? '';

  if (!username || !password) {
    return redirect('/register?error=Missing+fields');
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check if user exists
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return redirect('/register?error=User+already+exists');
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert user
    await db.execute(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hash]
    );

    return redirect('/register?success=Account+created!+You+can+log+in+now');
  } catch (err: any) {
    console.error('Registration error:', err.message, err.stack);
    return redirect('/register?error=Server+error');
  }
};
