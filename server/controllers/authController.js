const userModel = require('../models/userModel.js');
const passport = require('passport');

// GET-method for log in
module.exports.signIn_get = (req, res) => {

}

// redirect after authotization
module.exports.redirect = (req, res) => {
    if (req.user){
        // if user is authorized, then redirect him somewhere: home page, for example
        res.status(200).json({ success: true, message: "Authorized successfully" });
    } else {
        // otherwise authorization fails, then redirect user somewhere: login page, for example
        res.status(401).json({ success: false, message: "Authorization failed" });
    }
}

// sign out
module.exports.signOut = (req, res) => {
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