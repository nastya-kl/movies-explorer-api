const router = require('express').Router();

const {
  getLoggedUser,
  updateProfile,
} = require('../controllers/users');

router.get('/users/me', getLoggedUser);
router.patch('/users/me', updateProfile);

module.exports = router;
