const router = require('express').Router();

const {
  getLoggedUser,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getLoggedUser);
router.patch('/me', updateProfile);

module.exports = router;
