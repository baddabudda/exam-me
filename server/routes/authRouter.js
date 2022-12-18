// library dependencies
const express = require('express');
const router = express.Router();
const passport = require('passport');
// local dependencies
const authController = require('../controllers/authController.js');
const authHandler = require('../utils/authHandler.js');

// router for passpot authentication
router.get('/vk', passport.authenticate("vkontakte"));
// router for redirecting after successful authorization: firing cb function in strategy
router.get('/vk/redirect', passport.authenticate("vkontakte"), authController.redirect);
// router for signing out
router.get('/log-out', authHandler(req, res, next), authController.logOut);

module.exports = router;