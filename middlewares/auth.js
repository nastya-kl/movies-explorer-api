const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/config');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new Unauthorized('Необходимо авторизоваться'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    if (!token) return next(new Unauthorized('Необходимо авторизоваться'));
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new Unauthorized('Необходимо авторизоваться'));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
