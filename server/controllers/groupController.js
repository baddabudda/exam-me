// library dependencies
const jwt = require('jsonwebtoken');
// local dependencies
const errorHandler = require('../utils/errorHandler.js');
const groupModel = require('../models/groupModel.js');
const facultyModel = require('../models/facultyModel.js');
const programModel = require('../models/programModel.js');
const userModel = require('../models/userModel.js');
const listModel = require('../models/listModel.js');
const keys = require('../config/keys.js');
const {pool} = require('../config/config')

require('dotenv').config()

// check group name & course value
const checkContents = ({ group_name, course }) => {
    let errors = {
        group_name: undefined,
        course: undefined
    }
    let pass = true;
    
    if (!group_name) {
        errors.group_name = 'Group name is empty';
        pass = false;
    }
    if (isNaN(parseInt(course))){
        errors.course = 'Course is not a number';
        pass = false;
    }

    return { pass, errors };
}

// generate json web token
const maxAge = 1 * 5 * 60 * 60; // 5 hrs
const createToken = ({ group_id }) => {
    return jwt.sign({ group_id }, keys.webtoken.tokenKey, {
        expiresIn: maxAge
    });
}

const verifyToken = (token) => {
    let result = {
        pass: true,
        group_id: undefined
    };

    try {
        let tmp = jwt.verify(token, keys.webtoken.tokenKey, { complete: true});
        result.group_id = tmp.payload.group_id;
    } catch (error) {
        result.pass = false;
        return result;
    }
}

// check whether form sent correct faculty/program ids (that corresponds to db rows)
const checkMatch = async({ faculty_id, program_id }) => {
    let errors = {
        faculty: undefined,
        program: undefined
    }
    let pass = true;

    if (!await facultyModel.findFacultyById({ faculty_id: faculty_id })) {
        errors.faculty = "Faculty with given id doesn't exist";
        pass = false;
    }
    if (!await programModel.findProgramById({ program_id: program_id })) {
        errors.program = "Program with given id doesn't exist";
        pass = false;
    }

    return { pass, errors };
}

// GET-request for showing group info
module.exports.groupInfo_get = async (req, res) => {
    try {
        let group_id = parseInt(req.params.groupid);
        if (isNaN(group_id)){
            throw new Error("406 Group id is not a number");
        }
        if (!await groupModel.getGroupById({ group_id: group_id })){
            throw new Error("406 Group with given id not found");
        }
        // console.log(req.user);
        if (req.user.group_id !== group_id){
            throw new Error("403 Access denied: not a member");
        }

        let groupInfo = await groupModel.getGroupInfoById({ group_id: req.params.groupid });
        let memberInfo = await userModel.getGroupMembers({ group_id: req.params.groupid });
        let listInfo = await listModel.getListsByGroup({ group_id: req.params.groupid });

        res.status(200).json({...groupInfo, members: memberInfo,lists: listInfo});
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

module.exports.createGroup_post = async (req, res) => {
    try {
        if (req.user.group_id) {
            throw new Error("405 User is a member of another group already");
        }

        let content = checkContents({
            group_name: req.body.group_name,
            course: req.body.course
        });
        
        if (!content.pass) {
            throw new Error(`406 ${ content.errors.group_name ? content.errors.group_name : content.errors.course }`);
        }

        let result;
        try{
            result = await checkMatch({
                faculty_id: req.body.faculty_id,
                program_id: req.body.program_id
            })

        } catch (error) {
            throw new Error("500 Unexpected error in matching ids");
        }

        if (!result.pass) {
            throw new Error(`500 ${ result.errors.faculty ? result.errors.faculty : result.errors.program }`);
        }
        // if no errors, then begin transaction
        let connection = undefined;

        try {
            // get connection
            connection = await pool.promise().getConnection();
            // if we have connection, then make queries
            // set isolation level and begin transaction
            await connection.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            await connection.beginTransaction();
            await connection.query("LOCK TABLES academgroups WRITE, users WRITE");
            await groupModel.createGroup({
                connection: connection,
                faculty_id: req.body.faculty_id,
                program_id: req.body.program_id,
                admin_id: req.user.user_id,
                group_name: req.body.group_name,
                course: req.body.course
            });
            let [rows, fields] = await connection.query("SELECT last_insert_id()");
            let group_id = Object.values(rows[0])[0];

            await userModel.joinGroup({ connection: connection, user_id: req.user.user_id, group_id: group_id});

            await connection.query("UNLOCK TABLES");
            // the end of transaction: commit changes and release connection {id: order, id: order, id: order}
            await connection.commit();
            pool.releaseConnection(connection);

            res.status(200).json('Success')
        } catch (error) {
            // cancel transaction results and release connection
            connection.rollback();
            console.error(error);
            pool.releaseConnection(connection);
            throw new Error('500 Cannot execute query');
        }
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

module.exports.editGroup_put = async (req, res) => {
    try {
        let content = checkContents({
            group_name: req.body.group_name,
            course: req.body.course
        });

        if (!content.pass) {
            throw new Error(`${ content.errors.group_name ? content.errors.group_name : content.errors.course }`);
        }

        let admin_id = await groupModel.getGroupAdmin({ group_id: req.params.groupid });
        if (req.user.user_id !== admin_id.group_admin) {
            throw new Error("403 Access denied: not group admin");
        }

        await groupModel.editGroup({
            group_id: req.params.groupid,
            group_name: req.body.group_name,
            course: req.body.course
        });
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

// generate new token as invitation group; must return link
module.exports.generateInvitation_get = async (req, res) => {
    try {
        let admin_id = await groupModel.getGroupAdmin({ group_id: req.params.groupid });
        if (req.user.user_id !== admin_id.group_admin) {
            throw new Error("403 Access denied: not group admin");
        }
        let token = await groupModel.getToken({ group_id: req.params.groupid });
        token = token ? token.token : null;
        if (!token || !verifyToken(token).pass) {
            token = createToken({ group_id: req.params.groupid });
            await groupModel.assignToken({
                group_id: req.params.groupid,
                access_token: token
            }).catch(error => {
                throw new Error("500 Can't assign new token")
            });
        }
    
        // exam.me/join/group/:access_token
        res.status(200).json(`${process.env.UI_HOST}/join/:${token}`);
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

// expel member from the group
module.exports.expelMember_put = async (req, res) => {
    try {
        let admin_id = await groupModel.getGroupAdmin({ group_id: req.body.group_id });
        // check whether user has admin privilege
        if (req.user.user_id !== admin_id.group_admin) {
            throw new Error ("403 Can't perform expelling: not a group admin");
        }
        // check whether admin tries to expel themselves
        if (admin_id === req.body.delete_user_id) {
            throw new Error ("405 Can't expel admin");
        }
        // check whether user belongs to the group
        let member_id = await groupModel.checkMembership({ group_id: req.body.group_id, user_id: req.body.delete_user_id });
        if (!member_id) {
            throw new Error ("405 User isn't a group member");
        }

        // if all checks passed, execute expel
        await groupModel.expelMember({ group_id: req.body.group_id, user_id: req.body.delete_user_id }).catch(error => {
            throw new Error ("500 " + error.message);
        });

        res.status(200).json("User expelled successfully");
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

// put user to blacklist: no comments & editing
module.exports.blockUserLvl1_put = async (req, res) => {
    try {
        let admin_id = await groupModel.getGroupAdmin({ group_id: req.body.group_id });
        // check whether user has admin privilege
        if (req.user.user_id !== admin_id.group_admin) {
            throw new Error ("403 Can't perform block: not a group admin");
        }
        // check if user has been blocked by the group already
        let isBlocked = await userModel.checkInBlackList({ group_id: req.body.group_id, user_id: req.body.user_id });
        if (!isBlocked) {
            throw new Error ("405 Can't perform block: user is blocked already");
        }

        await userModel.blockUser({ group_id: req.body.group_id, user_id: req.body.user_id, block_level: 1}).catch(error => {
            throw new Error("500 " + error.message);
        })

        res.status(200).json("User has been blacklisted: not allowed to leave comments and edit your group's questions");
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

// put user to blacklist: no comments only
module.exports.blockUserLvl2_put = async (req, res) => {
    try {
        let admin_id = await groupModel.getGroupAdmin({ group_id: req.body.group_id });
        // check whether user has admin privilege
        if (req.user.user_id !== admin_id.group_admin) {
            throw new Error ("403 Can't perform block: not a group admin");
        }
        // check if user has been blocked by the group already
        let isBlocked = await userModel.checkInBlackList({ group_id: req.body.group_id, user_id: req.body.user_id });
        if (!isBlocked) {
            throw new Error ("405 Can't perform block: user is blocked already");
        }

        await userModel.blockUser({ group_id: req.body.group_id, user_id: req.body.user_id, block_level: 2}).catch(error => {
            throw new Error("500 " + error.message);
        })

        res.status(200).json("User has been blacklisted: not allowed to leave comments under your group's questions");
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

// remove user from blacklist
module.exports.unblockUser_put = async (req, res) => {
    try {
        let admin_id = await groupModel.getGroupAdmin({ group_id: req.body.group_id });
        // check whether user has admin privilege
        if (req.user.user_id !== admin_id.group_admin) {
            throw new Error ("403 Can't perform unblock: not a group admin");
        }
        // check if user is blocked by the group already
        let isBlocked = await userModel.checkInBlackList({ group_id: req.body.group_id, user_id: req.body.user_id });
        if (!isBlocked) {
            throw new Error ("405 Can't perform unblock: user is unblocked already");
        }

        await userModel.unblockUser({ group_id: req.body.group_id, user_id: req.body.user_id}).catch(error => {
            throw new Error("500 " + error.message);
        })

        res.status(200).json("User has been removed from blacklist");
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

module.exports.changeAdmin_put = async (req, res) => {
    try {
        let admin_id = await groupModel.getGroupAdmin({ group_id: req.body.group_id });
        // check whether user has admin privilege
        if (req.user.user_id !== admin_id.group_admin) {
            throw new Error ("403 Can't reassign admin: not a group admin");
        }
        // check if user has been blocked by the group
        let isBlocked = await userModel.checkInBlackList({ group_id: req.body.group_id, user_id: req.body.user_id });
        if (!isBlocked) {
            throw new Error ("405 Can't reassign admin : user is blocked ");
        }
        // check whether user belongs to the group
        let member_id = await groupModel.checkMembership({ group_id: req.body.group_id, user_id: req.body.user_id });
        if (!member_id) {
            throw new Error ("405 User isn't a group member");
        }

        // if everything is ok then update
        await groupModel.assignAdmin({
            group_id: req.body.group_id,
            user_id: req.body.user_id
        }).catch (error => {
            throw new Error ("500 Can't reassign admin: " + error.message);
        })

        res.status(200).json("Group admin privilege was reassigned");
    } catch (error) {
        errorHandler({res: res, error: error});
    }
}

module.exports.closeGroup_put = async (req, res) => {
    try {
        let admin_id = await groupModel.getGroupAdmin({ group_id: req.body.group_id });
        // check whether user has admin privilege
        if (req.user.user_id !== admin_id.group_admin) {
            throw new Error ("403 Can't perform block: not a group admin");
        }
        // check whether group is opened
        let group = await groupModel.getGroupById({ group_id: req.body.group_id });
        if (!group) {
            throw new Error("406 Group with given id doesn't exist");
        }
        if (group.is_closed !== 0) {
            throw new Error("406 Group has been closed already");
        }

        await groupModel.closeGroup({ group_id: req.body.group_id }).catch(error => {
            throw new Error("500 Can't close group: " + error.message);
        });

        res.status(200).json("Group has been closed successfully");
    } catch (error) {
        errorHandler({res: res, error: error});
    }
}