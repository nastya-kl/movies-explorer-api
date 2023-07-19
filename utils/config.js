const { NODE_ENV, JWT_SECRET } = process.env;
const rateLimit = require('express-rate-limit');

const SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
const PORT = 3000;
const DB_URL = NODE_ENV === 'production' ? process.env.DB_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  SECRET_KEY,
  PORT,
  DB_URL,
  limiter,
};
