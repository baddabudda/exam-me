const executor = require('./executor.js');

// create group
module.exports.createGroup = ({ connection, faculty_id, program_id, admin_id, group_name, course }) => {
    return executor.execute({
        connection: connection,
        query:
            "INSERT INTO academgroups (faculty_id, program_id, group_admin, " +
            "group_name, course, is_closed) " +
            "VALUES (?, ?, ?, ?, ?, 0)",
        params: [faculty_id, program_id, admin_id, group_name, course],
        single: true
    });
}

// edit group
module.exports.editGroup = ({ group_id, group_name, course }) => {
    return executor.execute({
        query:
            "UPDATE academgroups SET group_name = ?, course = ? WHERE group_id = ?",
        params: [group_name, course, group_id],
        single: true
    });
}

// close group
module.exports.closeGroup = ({ group_id }) => {
    return executor.execute({
        query:
            "UPDATE academgroups SET is_closed = 1 WHERE group_id = ?",
        params: [group_id],
        single: true
    });
}

// assign token
module.exports.assignToken = ({ group_id, access_token }) => {
    return executor.execute({
        query:
            "UPDATE academgroups SET access_token = ? WHERE group_id = ?",
        params: [access_token, group_id],
        single: true
    });
}

// get group by id
module.exports.getGroupById = ({ group_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM academgroups WHERE group_id = ?",
        params: [group_id],
        single: true
    });
}

// get group info
module.exports.getGroupInfoById = ({ group_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM academgroups " +
            "WHERE group_id = ?",
        params: [group_id],
        single: true
    });
}

// get group admin
module.exports.getGroupAdmin = ({ group_id }) => {
    return executor.execute({
        query:
            "SELECT group_admin FROM academgroups WHERE group_id = ?",
        params: [group_id],
        single: true
    });
}

// check whether user is a group admin
module.exports.checkPrivilege = ({ group_id, user_id }) => {
    return executor.execute({
        query:
            "SELECT COUNT(*) FROM academgroups WHERE group_admin = ? AND group_id = ?",
        params: [user_id, group_id],
        single: true
    });
}

// check whether user is a group member
module.exports.checkMembership = ({ group_id, user_id }) => {
    return executor.execute({
        query:
            "SELECT COUNT(*) FROM users WHERE user_id = ? AND group_id = ?",
        params: [user_id, group_id],
        single: true
    });
}

// get users by group
module.exports.getAllGroupMembers = ({ group_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM users WHERE group_id = ?",
        params: [group_id],
        single: false
    });
}