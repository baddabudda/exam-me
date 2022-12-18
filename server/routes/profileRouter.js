// library dependencies
const express = require('express');
const router = express.Router();
// local dependencies
const profileController = require('../controllers/profileController.js');
const authHandler = require('../utils/authHandler.js');

router.get('/', authHandler, profileController.profile_get);
router.post('/edit', authHandler, profileController.editProfile_post);

module.exports = router;