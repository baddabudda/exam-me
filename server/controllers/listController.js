const listModel = require('../models/listModel.js');
const subjectModel = require('../models/subjectModel.js');
const groupModel = require('../models/groupModel.js');
const errorHandler = require('../utils/errorHandler.js');

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
    if (!contents.is_public) {
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
            throw new Error("Subject is should be a number");
        }
        // if requested subject id exists in database
        let subject = await subjectModel.getSubjectById(req.params.subjectid);
        if (!subject) {
            throw new Error("Subject with given id doesn't exist in database");
        }

        // if everything is ok, send all public lists to display
        const lists = await listModel.getPublicBySubjId(req.params.subjectid);
        res.status(200).json(lists);
    } catch (error) {
        errorHandler({ res: res, code: 500, error: error.message });
    }
};

// creating new list
module.exports.createList_post = async (req, res) => {
    try {
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
        await listModel.createList({
            group_id: req.user.group_id,
            subject_id: req.body.subject_id,
            list_name: req.body.list_name,
            is_public: req.body.is_public,
            semester: req.body.semester
        });
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
    } catch (error) {
        errorHandler({ res: res, code: 500, error: error.message });
    }
}

// get list by id
module.exports.getListById = async (req, res) => {
    try{
        if (!isNan(parseInt(req.params.list_id))){
            const currentList = await listModel.getById(req.params.list_id);
            res.status(200).json({ currentList });
        } else {
            throw {code: 400, message: 'list_id is not a number!'};
        }
    } catch (err) {
        errorHandler(res, error);
    }
}