const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error;
const { CastError } = mongoose.Error;
const Movie = require('../modules/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

const {
  STATUS_CREATED,
  MESSAGE_SUCSESS,
  ERR_MESSAGE_WRONG_DATA,
  ERR_MESSAGE_MOVIE_NOT_FOUND,
  ERR_MESSAGE_FORBIDDEN,
} = require('../utils/constants');

const getSavedMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
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
        next(new BadRequest(ERR_MESSAGE_WRONG_DATA));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const ownerId = req.user._id;

  Movie.findById(movieId)
    .orFail(() => new NotFound(ERR_MESSAGE_MOVIE_NOT_FOUND))
    .then((movie) => {
      if (!movie.owner.equals(ownerId)) {
        return next(new Forbidden(ERR_MESSAGE_FORBIDDEN));
      }
      return Movie.deleteOne(movie)
        .then(() => res.send({ message: MESSAGE_SUCSESS }));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest(ERR_MESSAGE_WRONG_DATA));
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
