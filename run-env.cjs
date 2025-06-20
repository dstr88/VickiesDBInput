const dotenv = require('dotenv');
const path = require('path');
const { spawn } = require('child_process');

const mode = process.argv[2] === 'prod' ? 'prod' : 'local';
const envFile = path.resolve(process.cwd(), `.env.${mode}`);

console.log(`📦 Loading environment from: ${envFile}`);
dotenv.config({ path: envFile });

console.log('🚀 Starting server...');

const command = mode === 'prod' ? ['run', 'build'] : ['run', 'dev'];

const child = spawn('npm', command, {
  stdio: 'inherit',
  env: {
    ...process.env // ⬅️ this line makes sure all loaded vars are passed along
  }
});
