const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error;
const { CastError } = mongoose.Error;
const Movie = require('../modules/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const { STATUS_CREATED } = require('../utils/constants');

const getSavedMovies = (req, res, next) => {
  const userId = req.user._id;

  Movie.find({ userId })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((movie) => res.status(STATUS_CREATED).send({ data: movie }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const ownerId = req.user._id;

  Movie.findById(movieId)
    .orFail(() => new NotFound('Карточка с указанным id не найдена'))
    .then((movie) => {
      if (!movie.owner.equals(ownerId)) {
        return next(new Forbidden('Невозможно удалить карточку, созданную другим пользователем'));
      }
      return Movie.deleteOne(movie)
        .then(() => res.send({ message: 'Фильм удалён' }));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Переданы некорректные данные для удаления карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getSavedMovies,
  createMovie,
  deleteMovie,
};
