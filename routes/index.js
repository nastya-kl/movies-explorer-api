const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const NotFound = require('../errors/NotFound');
const { signInValidation, signUpValidation } = require('../utils/validation');
const { ERR_MESSAGE_NONEXISTENT_URL } = require('../utils/constants');

router.use('/signin', signInValidation, login);
router.use('/signup', signUpValidation, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFound(ERR_MESSAGE_NONEXISTENT_URL));
});

module.exports = router;
