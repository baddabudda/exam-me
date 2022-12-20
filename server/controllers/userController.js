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
        let tmp = jwt.verify(token, keys.webtoken.tokenKey, { complete: true});
        result.group_id = tmp.payload.group_id;
        return result;
    } catch (error) {
        result.pass = false;
        return result;
    }
}

module.exports.profile_get = async (req, res) => {
    console.log('profile');
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
                fname: req.body.fname,
                lname: req.body.lname,
                pname: req.body.pname
            });
            // res.status(200).json("cool");
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
        let verified = verifyToken(req.params.token);
        console.log(verified);

        if (!verified.pass) {
            throw new Error('Access token has expired');
        }

        if (!await groupModel.getGroupById({ group_id: verified.group_id })) {
            throw new Error('Group with such id not found');
        }

        if (req.user.group_id === verified.group_id) {
            res.status(200).json("Redirecting to group page");
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