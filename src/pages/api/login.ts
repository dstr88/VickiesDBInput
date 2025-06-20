import type { APIRoute } from 'astro';
import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const username = formData.get('username')?.toString() || '';
  const password = formData.get('password')?.toString() || '';

  try {
    // Connect to MySQL
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Look up user
    const [rows] = await db.execute(
      'SELECT id, password FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/login?error=Invalid credentials' }
      });
    }

    const user = rows[0] as any;
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/login?error=Invalid credentials' }
      });
    }

    // Set auth cookie
    cookies.set('auth', String(user.id), {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD
    });

    return redirect('/home');
  } catch (err) {
    console.error('Login error:', err);
    return new Response(null, {
      status: 302,
      headers: { Location: '/login?error=Server error' }
    });
  }
};
