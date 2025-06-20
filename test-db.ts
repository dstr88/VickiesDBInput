import 'dotenv/config'; // ✅ Must be the very first import!

// test-db.ts
let ArticleData: typeof import('./src/lib/ArticleData.js').ArticleData;

try {
  // Dynamically import ArticleData in case the constructor throws (e.g., missing .env)
  const module = await import('./src/lib/ArticleData.js');
  ArticleData = module.ArticleData;
} catch (e) {
  console.error('❌ Failed to import ArticleData. Did the constructor throw?');
  console.error(e);
  process.exit(1);
}

// 🧪 Attempt to construct the class
const articleData = new ArticleData();
console.log("✅ ArticleData instance created.");

async function test() {
  try {
    const posts = await articleData.getPosts();

    if (posts === null) {
      console.error('❌ No posts returned. Connection or query likely failed.');
      return;
    }

    if (posts.length === 0) {
      console.log('✅ Connected to DB, but no posts found.');
    } else {
      console.log(`✅ Retrieved ${posts.length} post(s).`);
      console.dir(posts[0], { depth: null });
    }

    await articleData.close();
  } catch (error) {
    console.error('❌ Caught error:');
    console.error(error instanceof Error ? error.stack : error);
  }
}

test();
