// hash.js
const bcrypt = require('bcryptjs');

bcrypt.hash('herPassword123', 10).then((hash) => {
  console.log('Hashed password:', hash);
});
