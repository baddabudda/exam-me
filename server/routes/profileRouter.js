const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController.js');
const passport = require('passport');

router.get('/', profileController.profile_get);
router.post('/edit', profileController.editProfile_post);

module.exports = router;