require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { createClient } = require('./config/redis');

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tmtc';
const REDIS_URL = process.env.REDIS_URL || null;

(async () => {
  await connectDB(MONGO_URI);
  if (REDIS_URL) createClient(REDIS_URL);
  app.listen(PORT, () => console.log('Server listening on', PORT));
})();
