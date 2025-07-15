import 'dotenv/config';
import dotenv from 'dotenv';

const envPath = process.env.NODE_ENV?.trim() === 'production'
  ? '.env.production'
  : '.env.development';

dotenv.config({ path: envPath });


const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

if (!USERNAME || !PASSWORD) {
  throw new Error("❌ Missing USERNAME or PASSWORD in .env");
}

export { USERNAME, PASSWORD };
