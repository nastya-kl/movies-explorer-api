const router = require('express').Router();
const { newMovieValidation, movieIdValidation } = require('../utils/validation');

const {
  getSavedMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getSavedMovies);
router.post('/', newMovieValidation, createMovie);
router.delete('/_id', movieIdValidation, deleteMovie);

module.exports = router;
