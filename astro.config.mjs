// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import dotenv from 'dotenv';

// Load .env early
dotenv.config();

export default defineConfig({
  output: 'server', // Enables SSR (required for DB/auth)
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [],
});
