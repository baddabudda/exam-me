// importing query executor
const executor = require('./executor.js');
const pool = require('../config/config.js');

// check list accessibility
module.exports.checkListAccess = ({ group_id, user_id, list_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM lists, users WHERE lists.list_id = ? AND lists.group_id = users.group_id AND users.group_id = ? AND users.user_id = ?",
        params: [list_id, group_id, user_id],
        single: true
    });
}

// check admin privilege for list
module.exports.checkListPrivilege = ({ group_id, user_id, list_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM lists, academgroups WHERE lists.list_id = ? AND lists.group_id = academgroups.group_id " +
            "AND academgroups.group_id = ? AND academgroups.group_admin = ?",
        params: [list_id, group_id, user_id],
        single: true
    });
}

// getting all lists
module.exports.getAllLists = () => {
    return executor.execute({
        query:
            "SELECT * FROM lists WHERE is_public = 1",
        params: [],
        single: false
    });
};

// getting list by list_id
module.exports.getById = (listId => {
    return executor.execute({
        query:
            "SELECT * FROM lists WHERE list_id = ?",
        params: [listId],
        single: true
    });
});

// getting all public lists by subject_id 
module.exports.getPublicBySubjId = (subjId => {
    return executor.execute({
        query:
            "SELECT * FROM lists WHERE subject_id = ? AND is_public = 1",
        params: [subjId],
        single: false
    });
});

// get list's length
module.exports.getListLengthById = ({ listId }) => {
    return executor.execute({
        query:
            "SELECT COUNT(*) FROM lists WHERE list_id = ?",
        params: [listId],
        single: true
    });
}