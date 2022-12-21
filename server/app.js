// === NODE MODULES REQUIREMENTS ===
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors')

// === INNER PROJECT REQUIREMENTS ===
// --- Configuration, etc. ---
const keys = require('./config/keys.js');
// --- routing ---
const authRoutes = require('./routes/authRouter.js');
const groupRoutes = require('./routes/groupRouter.js');
const singleRoutes = require('./routes/singleRouters.js');
const profileRoutes = require('./routes/profileRouter.js');
const questionRoutes = require('./routes/questionRouter.js');
const passportSetup = require('./config/passport-setup.js');

// === DOTENV CONFIG ===
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// === CREATING EXPRESS APP
const app = express();

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

// --- enable cors ---
app.use(cors({origin: process.env.UI_HOST, credentials: true}));

// --- routing ---
app.use('/api', singleRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("Hello, world!")
})

app.listen(PORT, () => console.log(`Exam Me backend is working...`));

