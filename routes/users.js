const router = require('express').Router();
const { userProfileInfoValidation } = require('../utils/validation');

const {
  getLoggedUser,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getLoggedUser);
router.patch('/me', userProfileInfoValidation, updateProfile);

module.exports = router;
