const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
const regex = /https?:\/\/(www\.)?[-\w@:%\.\+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%\.\+~#=//?&]*)/i;

// Валидация:

// login
const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

// registration
const signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

// updateProfile
const userProfileInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

// createMovie
const newMovieValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(regex),
  }),
});

// getMovieId
const movieIdValidation = celebrate({
  params: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().patteern(regex),
    trailerLink: Joi.string().required().patteern(regex),
    thumbnail: Joi.string().required().patteern(regex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation,
  userProfileInfoValidation,
  newMovieValidation,
  movieIdValidation,
};
