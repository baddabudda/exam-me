const userModel = require('../models/userModel.js');
const passport = require('passport');
require('dotenv').config();

// redirect after authotization
module.exports.redirect = (req, res) => {
    if (req.user.status){
        // if 1 = not registrational authorization
        // res.status(200).json({ success: true, message: "Authorized successfully; return to the page", user: req.user });
        res.redirect(`${process.env.UI_HOST}/`)
    } else if (!req.user.status) {
        // if 0 = registrational authorization
        res.redirect(`${process.env.UI_HOST}/login`)
        // res.status(200).json({ success: true, message: "Authorized successfully; redirect profile page", user: req.user });
    } else {
        res.status(401).json({ success: false, message: "Authorization failed" });
    }
}

// log out
module.exports.logOut = (req, res) => {
    if (req.user){
        // destroy req.user (is it necessary tho?)
        req.logOut();
        // clear cookie session after log out
        req.session = null;
        // if user is authorized, then redirect somewhere: home page
        res.status(200).json({ success: true, message: "Signed out successfully" });
    } else {
        // otherwise don't do anything?
        res.status(401).json({ success: false, message: "Sign out failed: unauthorized" });
    }
}