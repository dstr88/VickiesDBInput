-- schema.sql

-- Drop tables if they exist (for dev rebuilds)
DROP TABLE IF EXISTS proverb;
DROP TABLE IF EXISTS posts;

-- 🧠 Proverb table
CREATE TABLE proverb (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  source VARCHAR(255),
  is_private BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 📝 Blog post table
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
