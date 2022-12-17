const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const passport = require('passport');

// router for sign in
// router.get('/sign-in', authController.signIn_get);
// router for passpot authentication
router.get('/vk', passport.authenticate("vkontakte"));
// router for redirecting after successful authorization
router.get('/vk/redirect', passport.authenticate("vkontakte"), authController.redirect);
// router for signing out
router.get('/log-out', authController.logOut);

module.exports = router;