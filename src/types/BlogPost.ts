// src/types/BlogPost.ts
export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  views: number; // ✅ Add this
};

