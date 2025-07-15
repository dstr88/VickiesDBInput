// src/types/Proverb.ts
export interface Proverb {
  id: number;
  text: string;
  source: string | null;
  created_at: string;
  slug?: string; // ✅ Add this line to support slug usage
}
