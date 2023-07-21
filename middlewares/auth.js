const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/config');
const Unauthorized = require('../errors/Unauthorized');
const { ERR_MESSAGE_AUTHORIZATION } = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new Unauthorized(ERR_MESSAGE_AUTHORIZATION));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    if (!token) return next(new Unauthorized(ERR_MESSAGE_AUTHORIZATION));
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new Unauthorized(ERR_MESSAGE_AUTHORIZATION));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
