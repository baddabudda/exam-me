// === REQUIREMENTS ===
const passport = require('passport');
const VKStrategy = require('passport-vkontakte').Strategy;
const keys = require('./keys.js');
const user = require('../models/userModel.js');

// === (DE)SERIALIATION ===
passport.serializeUser((profileData, done) => {
    done(null, profileData.vkId);
 });
 
 passport.deserializeUser((vkId, done) => {
     user.find_by_vkId(vkId)
     .then(currentUser => {
         console.log(currentUser);
         done(null, currentUser);
     })
 });
 
 // === CREATING STRATEGY FOR VK AUTHENTICATION ===
 passport.use(
     new VKStrategy(
         {
             clientID: keys.vk.clientID,
             clientSecret: keys.vk.clientSecret,
             callbackURL: "/auth/vk/redirect",
             profileFields: ["id", "first_name", "last_name"],
             lang: "ru"
         },
         (
             req, 
             accessToken, 
             refreshToken, 
             params, 
             profile, 
             done
         ) => {
             let profileData = {
                 vkId: profile._json.id,
                 fname: profile._json.first_name,
                 lname: profile._json.last_name
             };
 
             // We will call done for all successful authorizations
             // so we will serialize all vk users and give then cookies
             // after serializing we will check user in db
             done(null, profileData);
         }
     )
 );