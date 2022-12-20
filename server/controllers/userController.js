// library dependencies
const jwt = require('jsonwebtoken');
// local dependendencies
const userModel = require('../models/userModel.js');
const groupModel = require('../models/groupModel.js');
const errorHandler = require('../utils/errorHandler.js');
const keys = require('../config/keys.js');

const verifyToken = (token) => {
    let result = {
        pass: true,
        group_id: undefined
    };

    try {
        result.group_id = jwt.verify(token, keys.webtoken.tokenKey).group_id;
        return result;
    } catch (error) {
        result.pass = false;
        return result;
    }
}

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



module.exports.editProfile_put = async (req, res) => {
    try {
        try {
            await userModel.editUser({
                user_id: req.user.user_id,
                fname: req.body.user_fname || req.user.user_fname,
                lname: req.body.user_lname || req.user.user_lname,
                pname: req.body.user_pname || req.user.user_pname
            });

            res.status(200).json({success: true, message: 'User update is successful'})
        } catch (error) {
            throw new Error('Cannot update profile info');
        }
    } catch (error) {
        errorHandler(res, {message: error.message });
    }
}

module.exports.joinGroup_post = async (req, res) => {
    try {
        // verify token and check whether such group exists
        let verified = verifyToken(res.query.token);

        if (!verified.pass) {
            throw new Error('Access token has expired');
        }

        if (!await groupModel.getGroupById({ group_id: verified.group_id })) {
            throw new Error('Group with such id not found');
        }

        if (req.user.group_id === verified.group_id) {
            // just redirect to group page
        } else if (req.user.group_id) {
            throw new Error('User is a member of another group already');
        } else {
            // if everything is ok, then user can join group
            await userModel.joinGroup({ user_id: req.user.user_id, group_id: verified.group_id });
        }
        
    } catch (error) {
        errorHandler({res: res, code: 500, error: error});
    }
}