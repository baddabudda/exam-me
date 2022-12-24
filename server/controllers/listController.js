const listModel = require('../models/listModel.js');
const subjectModel = require('../models/subjectModel.js');
const groupModel = require('../models/groupModel.js');
const inviteModel = require('../models/inviteModel');
const errorHandler = require('../utils/errorHandler.js');

// generate json web token for list invitation
const maxAge = 1 * 5 * 60 * 60; // 5 hrs
const createToken = ({ group_id, list_id }) => {
    return jwt.sign({ group_id, list_id }, keys.webtoken.tokenKey, {
        expiresIn: maxAge
    });
}

const verifyToken = (token) => {
    let result = {
        pass: true,
        group_id: undefined,
        list_id: undefined
    };

    try {
        let tmp = jwt.verify(token, keys.webtoken.tokenKey, { complete: true });
        result.group_id = tmp.payload.host_id;
        result.list_id = tmp.payload.list_id;
    } catch (error) {
        result.pass = false;
        return result;
    }
}

// check body for emptiness
const checkContents = (contents) => {
    let errors = {
        subject_id: undefined,
        list_name: undefined,
        is_public: undefined,
        semester: undefined
    };
    let pass = true;

    if (isNaN(parseInt(contents.subject_id))){
        errors.subject_id = 'Subject id is not a number';
        pass = false;
    }
    if (!contents.list_name) {
        errors.list_name = 'List name is empty';
        pass = false;
    }
    if (contents.is_public == undefined) {
        errors.is_public = "List's publicity chosen";
        pass = false;
    }
    if (!contents.semester) {
        errors.semester = 'Enter semester';
        pass = false;
    }

    return { pass, errors };
}

// get all public lists by subject_id
module.exports.getPublicBySubjectId_get = async (req, res) => {
    try {
        // if subjectid is number, then work
        if (isNaN(parseInt(req.params.subjectid))){
            throw new Error("406 Subject is should be a number");
        }
        // if requested subject id exists in database
        let subject = await subjectModel.getSubjectById(req.params.subjectid);
        if (!subject) {
            throw new Error("406 Subject with given id doesn't exist in database");
        }

        // if everything is ok, send all public lists to display
        const lists = await listModel.getPublicBySubjId(req.params.subjectid);
        res.status(200).json(lists);
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
};

// creating new list
module.exports.createList_post = async (req, res) => {
    try {
        const listOwner = await listModel.getListOwner_bygrid({ group_id: req.body.group_id });
        // check is_closed
        // if (listOwner.is_closed) {
        //     throw new Error("403 Access denied: group has been closed");
        // }
        // check group membership
        if (!req.user.group_id) {
            throw new Error ("Can't create new list: user isn't a member of any group");
        }
        
        // check admin privilege to create list: we automatically check group-list connection
        let admin = await groupModel.checkPrivilege({ group_id: req.params.groupid, user_id: req.user.user_id });
        if (!admin) {
            throw new Error ("Can't create new list: user doesn't have admin privilege");
        }
        
        // check contents
        let content = checkContents(req.body);
        if (!content.pass) {
            throw new Error("Can't create new list: check form for emptiness");
        }
        
        // if everything is ok, create new list
        const result = await listModel.createList({
            group_id: req.user.group_id,
            subject_id: req.body.subject_id,
            list_name: req.body.list_name,
            is_public: req.body.is_public,
            semester: req.body.semester
        });
        
        res.status(200).json({id: result.insertId});
    } catch (error) {
        errorHandler({ res: res, code: 500, error: error.message });
    }
}

// publish list
module.exports.publishList_post = async (req, res) => {
    try {

        // check group membership
        if (req.user.group_id !== parseInt(req.params.groupid)) {
            throw new Error ("Can't create new list: user isn't a member of any group");
        }
        // check admin privilege before publishing
        let admin = await listModel.checkListPrivilege({ group_id: req.params.groupid, user_id: req.user.user_id, list_id: req.params.listid })
        if (!admin) {
            throw new Error ("Can't create new list: user doesn't have admin privilege");
        }

        // if everything is ok, create new list
        await listModel.publishList({ list_id: req.params.listid });
        res.status(200).json();
    } catch (error) {
        console.log(error);
        errorHandler({ res: res, code: 500, error: error.message });
    }
}

// get list by id
module.exports.getListById = async (req, res) => {
    try{
        const list_id = req.params.listid;
        if (!isNan(parseInt(list_id))){
            const currentList = await listModel.getById(list_id);
            res.status(200).json( currentList );
        } else {
            throw {code: 400, message: 'list_id is not a number!'};
        }
    } catch (err) {
        errorHandler({res: res, code: 500, err: err});
    }
}

const isNan = (val) => val === NaN;

// generate new token for list invitation; must return link
module.exports.shareList_post = async (req, res) => {
    try {
        // check admin privilege
        let admin_id = await groupModel.getGroupAdmin({ group_id: req.body.group_id });
        if (req.user.user_id !== admin_id.group_admin) {
            throw new Error("403 Access denied: not group admin");
        }
        // check whether list belongs to that group
        if (!await listModel.checkListOwner({ list_id: req.body.list_id, group_id: req.body.group_id })) {
            throw new Error("406 List doesn't belong to this group");
        }
        // check whether list has good token
        let token = await listModel.checkToken({ list_id: req.body.list_id, group_id: req.body.group_id });
        // verifyToken returns false if token = undefined
        let verified = verifyToken(token);
        if (!token || !verified.pass) {
            // if list doesn't have token or is expired, then create new token
            token = createToken({ group_id: req.body.group_id, list_id: req.body.list_id });
            await listModel.updateToken({
                token: token, 
                list_id: req.body.list_id, 
                group_id: req.body.group_id 
            }).catch(error => {
                throw new Error("500 Couldn't update token: " + error.message);
            });
        }
        
        // OPEN ISSUE: redirect link required !!!!!
        res.status(200).json(`${process.env.UI_HOST}/shared/:${token}`);
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

// accept shared list
module.exports.acceptList_post = async (req, res) => {
    try {
        // check admin privilege to accept invitation
        let admin_id = await groupModel.getGroupAdmin({ group_id: req.body.group_id });
        if (req.user.user_id !== admin_id.group_admin) {
            throw new Error("403 Access denied: not group admin");
        }
        // verify token
        let verified = verifyToken(res.query.token);
        // if token has expired
        if (!verified.pass) {
            throw new Error("403 Access token has expired");
        }
        // if everything is cool, insert invite
        await inviteModel.acceptInvite({
            group_host_id: verified.group_id,
            group_guest_id: req.user.group_id,
            list_id: verified.list_id
        }).catch(error => {
            throw new Error("500 Couldn't accept invite " + error.message);
        })

        res.status(200).json("Accepted list invite successfully");
    } catch (error) {
        errorHandler({ res: res, error: error});
    }
}

// change access level
module.exports.changeAccessLevel_put = async (req, res) => {
    try {
        // check admin privilege to change access level
        let admin_id = await groupModel.getGroupAdmin({ group_id: req.body.group_host_id });
        if (req.user.user_id !== admin_id.group_admin) {
            throw new Error("403 Access denied: not group admin");
        }
        // check invitation record
        if (!await inviteModel.checkInvite({ group_host_id: req.body.group_host_id, group_guest_id: req.body.group_guest_id, list_id: req.body.list_id } )) {
            throw new Error("406 No invite with given parameters found");
        }
        // if ok, then
        await inviteModel.changeAccessLevel({
            group_host_id: req.body.group_host_id, 
            group_guest_id: req.body.group_guest_id, 
            list_id: req.body.list_id,
            access_level: req.body.access_level
        }).catch (error => {
            throw new Error("500 Can't change acces level " + error.message);
        })

        res.status(200).json("Access level changed successfully");
    } catch (error) {
        errorHandler({ res: res, error: error});
    }
}