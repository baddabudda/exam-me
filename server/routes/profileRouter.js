// library dependencies
const express = require('express');
const router = express.Router();
// local dependencies
const userController = require('../controllers/userController.js');
const authHandler = require('../utils/authHandler.js');

// exam.me/prfoile/
router.get('/', authHandler, userController.profile_get);
// exam.me/profile/edits
router.post('/edit', authHandler, userController.editProfile_post);

module.exports = router;