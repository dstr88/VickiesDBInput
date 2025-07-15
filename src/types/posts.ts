// src/types/posts.ts
export type Post = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  isPrivate: boolean;
  createdAt: string; // ISO date string
  views: number;     // 💯 required for view tracking
};
