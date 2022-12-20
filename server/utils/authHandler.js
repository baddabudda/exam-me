const passport = require('passport');

// middleware to check authorization for routes
module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ success: false, message: "Not authorized" });
    } else {
        next();
    }
}