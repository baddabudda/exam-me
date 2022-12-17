const userModel = require('../models/userModel.js');
const errorHandler = require('../utils/errorHandler.js');

module.exports.profile_get = async (req, res) => {
    if (req.user) {
        if (!req.user.status) {
            // console.log('here!');
            await userModel.changeStatus({user_id: req.user.user_id});
        }
        res.status(200).json({ success: true, message: "Profile-GET is successful", user: req.user });
    } else {
        res.status(401).json({ success: false, message: "Authorization required, redirect" });
    }
}

module.exports.editProfile_post = async (req, res) => {
    try {
        try {
            await userModel.editUser({
                user_id: req.user.user_id,
                fname: req.user.user_fname,
                lname: req.user.user_lname,
                pname: req.user.user_pname
            });
        } catch (error) {
            throw new Error('Cannot update profile info');
        }
    } catch (error) {
        errorHandler(res, {message: error.message });
    }
}