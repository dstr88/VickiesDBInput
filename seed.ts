// seed.ts
import { db } from './src/lib/db.ts';

async function seed() {
  console.log('🌱 Seeding database...');

  // --- Proverbs ---
  await db.run(`DELETE FROM proverb`);
  await db.run(
    `INSERT INTO proverb (text, source, is_private) VALUES (?, ?, ?)`,
    [
      "Trust in the Lord with all your heart, and lean not on your own understanding.",
      "Proverbs 3:5",
      false,
    ]
  );
  await db.run(
    `INSERT INTO proverb (text, source, is_private) VALUES (?, ?, ?)`,
    [
      "A gentle answer turns away wrath, but a harsh word stirs up anger.",
      "Proverbs 15:1",
      true,
    ]
  );

  // --- Blog Posts ---
  await db.run(`DELETE FROM posts`);
  await db.run(
    `INSERT INTO posts (title, slug, summary, content, is_private) VALUES (?, ?, ?, ?, ?)`,
    [
      "Welcome to the Blog",
      "welcome-to-the-blog",
      "A short intro to this blog and what it's all about.",
      "<p>This is our very first post. We're excited you're here!</p>",
      false,
    ]
  );
  await db.run(
    `INSERT INTO posts (title, slug, summary, content, is_private) VALUES (?, ?, ?, ?, ?)`,
    [
      "Behind the Scenes",
      "behind-the-scenes",
      "A look at how this site was built and maintained.",
      "<p>Lots of love and sweat went into this little project.</p>",
      true,
    ]
  );

  console.log('✅ Done seeding!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
});
