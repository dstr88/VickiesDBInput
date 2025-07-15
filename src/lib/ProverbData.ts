import { db } from './db';
import type { Proverb } from '../types/Proverbs';
import { slugify } from './slugify';

let cachedProverb: { date: string; proverb: Proverb } | null = null;

export class ProverbData {
  async getDailyProverb(): Promise<Proverb> {
    const today = new Date().toISOString().split("T")[0];

    // Return cached if it's today's proverb
    if (cachedProverb?.date === today) {
      return cachedProverb.proverb;
    }

    // Env flag disables DB fetch
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.ALLOW_DB_ACCESS !== 'true'
    ) {
      console.warn("⚠️ DB access is disabled by env. Returning default proverb.");
      return {
        id: 0,
        text: "Trust in the Lord with all your heart, and lean not on your own understanding.",
        source: "Proverbs 3:5",
        created_at: today,
        slug: "trust-in-the-lord"
      };
    }

    const proverbs = (await db.all(`SELECT * FROM proverb ORDER BY created_at ASC`) as Proverb[]).map(
      (p) => ({
        ...p,
        slug: p.slug || slugify(p.text),
      })
    );

    if (proverbs.length === 0) {
      throw new Error("No proverbial wisdom found in this DB today!!");
    }

    const index = new Date().getDate() % proverbs.length;
    const selected = proverbs[index];

    cachedProverb = { date: today, proverb: selected };
    return selected;
  }

  async getAllProverbs(): Promise<Proverb[]> {
    const rows = await db.all(`SELECT * FROM proverb ORDER BY created_at DESC`) as Proverb[];
    return rows.map((p) => ({
      ...p,
      slug: p.slug || slugify(p.text),
    }));
  }

  async getProverbBySlug(slug: string): Promise<Proverb | null> {
    const result = await db.get(`SELECT * FROM proverb WHERE slug = ?`, [slug]) as Proverb | undefined;
    return result ? { ...result, slug: result.slug || slugify(result.text) } : null;
  }
}
