// === NODE MODULES REQUIREMENTS ===
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session');

// === INNER PROJECT REQUIREMENTS ===
// --- Configuration, etc. ---
const keys = require('./config/keys.js');
// --- routing ---
const singleRoutes = require('./routes/singleRouters.js');
//const authRoutes = require('./routes/authRouter.js');
//const profileRoutes = require('./routes/profileRouter.js');
//const passportSetup = require('./config/passport-setup.js');

// === DOTENV CONFIG ===
require('dotenv').config();

// === CREATING EXPRESS APP
const app = express();
app.listen(3000);

// === MIDDLEWARE ===
// --- getting info about queries ---
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// --- for parsing .json files ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// --- parse cookies and sessions ---
app.use(require('cookie-parser')());
app.use(cookieSession({
    // hours, mins, secs, millisecs
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// --- initialize passport session ---
app.use(passport.initialize());
app.use(passport.session());

// --- routing ---
app.use(singleRoutes);