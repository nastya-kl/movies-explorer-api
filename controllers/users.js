const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error;
const { CastError } = mongoose.Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../modules/user');
const { SECRET_KEY } = require('../utils/config');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const { STATUS_CREATED, ERR_CODE_UNIQ } = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(STATUS_CREATED).send({
      name, email,
    }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании профиля'));
      } else if (err.code === ERR_CODE_UNIQ) {
        next(new Conflict('Пользователь с таким Email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const getLoggedUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => new NotFound('Пользователь с таким id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Введён некорректный id'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => new NotFound('Пользователь с таким id не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );

      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getLoggedUser,
  updateProfile,
  login,
};
