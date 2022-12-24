// importing query executor
const executor = require('./executor.js');
const { pool } = require('../config/config.js');

// check list accessibility
module.exports.checkListAccess = ({ group_id, user_id, list_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM lists, users WHERE lists.list_id = ? AND lists.group_id = users.group_id AND users.group_id = ? AND users.user_id = ?",
        params: [list_id, group_id, user_id],
        single: true
    });
    
}

// check list accessibility
// module.exports.checkListAccess = ({ group_id, user_id, list_id }) => {
//     return executor.execute({
//         query:
//             "SELECT * FROM lists, users WHERE lists.list_id = ? AND lists.group_id = users.group_id AND users.group_id = ? AND users.user_id = ?",
//         params: [list_id, group_id, user_id],
//         single: true
//     });
// }

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

// getting list by list_id
module.exports.getById = (listId => {
    return executor.execute({
        query:
            `SELECT * 
            FROM lists
            JOIN subjects on lists.subject_id=subjects.subject_id
            WHERE list_id = ?`,
        params: [listId],
        single: true
    });
});

// getting all public lists by subject_id 
module.exports.getPublicBySubjId = (subjId => {
    return executor.execute({
        query: `SELECT * FROM lists  JOIN subjects on lists.subject_id=subjects.subject_id WHERE lists.subject_id = ? AND is_public = 1`,
        // query: `SELECT * FROM lists WHERE subject_id = ?`,
        params: [subjId],
        single: false
    });
});



// getting all lists
module.exports.getAllLists = () => {
    return executor.execute({
        query:
            "SELECT * FROM lists WHERE is_public = 1",
        params: [],
        single: false
    });
};

// get list's length
module.exports.getListLengthById = ({ listId }) => {
    return executor.execute({
        query:
            "SELECT * FROM question WHERE list_id = ? AND is_deleted = 0",
        params: [listId],
        single: false
    });
}

// creating list
module.exports.createList = ({ group_id, subject_id, list_name, is_public, semester }) => {
    return executor.execute({
        query: 
            "INSERT INTO lists (group_id, subject_id, list_name, is_public, semester) " +
            "VALUES (?, ?, ?, ?, ?)",
        params: [group_id, subject_id, list_name, is_public, semester],
        single: false
    });
}

// publish list
module.exports.publishList = ({ list_id }) => {
    return executor.execute({
        query:
            "UPDATE lists SET is_public = 1 WHERE list_id = ?",
        params: [list_id],
        single: true
    });
}

// check list publicity
module.exports.checkPublic = ({ list_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM lists WHERE list_id = ? AND is_public = 1",
        params: [list_id],
        single: true
    });
}

// get all lists by group
module.exports.getListsByGroup = ({ group_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM lists WHERE group_id = ?",
        params: [group_id],
        single: false
    });
}

// get group by list 
module.exports.getListOwner = ({ list_id }) => {
    return executor.execute({
        query:
            "SELECT group_id FROM lists WHERE list_id = ?",
        params: [list_id],
        single: true
    });
}
module.exports.getListOwner_bygrid = ({ group_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM academgroups WHERE group_id = ?",
        params: [group_id],
        single: true
    });
}

// check relation list-group
module.exports.checkListOwner = ({ list_id, group_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM lists WHERE list_id = ? AND group_id = ?",
        params: [list_id, group_id],
        single: true
    });
}

// add token
module.exports.updateToken = ({ token, list_id, group_id }) => {
    return executor.execute({
        query:
            "UPDATE lists SET token = ? WHERE list_id = ? AND group_id = ?",
        params: [token, list_id, group_id],
        single: true
    });
}

// check token
module.exports.checkToken = ({ list_id, group_id }) => {
    return executor.execute({
        query:
            "SELECT token FROM lists WHERE list_id = ? AND group_id = ?",
        params: [list_id, group_id],
        single: true
    });
}