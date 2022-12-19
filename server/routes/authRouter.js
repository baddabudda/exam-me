// library dependencies
const express = require('express');
const router = express.Router();
const passport = require('passport');
const cookieParser = require('cookie-parser');
// local dependencies
const authController = require('../controllers/authController.js');
const authHandler = require('../utils/authHandler.js');

// router for passpot authentication: exam.me/auth/vk
router.get('/vk', passport.authenticate("vkontakte"));
// router for redirecting after successful authorization: firing cb function in strategy: exam.me/auth/vk/redirect
router.get('/vk/redirect', passport.authenticate("vkontakte"), authController.redirect);
// router for signing out: exam.me/auth/logout
router.get('/logout', authHandler, authController.logOut);
//

module.exports = router;