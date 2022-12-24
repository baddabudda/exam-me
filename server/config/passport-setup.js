// === REQUIREMENTS ===
const passport = require('passport');
const VKStrategy = require('passport-vkontakte').Strategy;
const keys = require('./keys.js');
const userModel = require('../models/userModel.js');

// === (DE)SERIALIATION ===
// which data of user must be stored in the session
passport.serializeUser((user, done) => {
    done(null, user.user_id);
 });
 
 // attaches user object to req.user
 passport.deserializeUser((id, done) => {
    userModel.getUserById({ user_id: id })
    .then(currentUser => {
        done(null, currentUser);
    }).
    catch (err => {
        console.error(err);
    });
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
         }, async (req, accessToken, refreshToken, params, profile, done) => {
            // check whether user with such vk_id exists in database
            let user = await userModel.getUserByVkId({ vk_id: profile._json.id });
            if (!user){
                await userModel.createUser({
                    vk_id: profile._json.id,
                    fname: profile._json.first_name,
                    lname: profile._json.last_name
                });

                user = await userModel.getUserByVkId({ vk_id: profile._json.id });
            }

            // pass user during authorization
            done(null, user);
         }
     )
 ); 