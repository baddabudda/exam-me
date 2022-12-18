const executor = require('./executor.js');

// create group
module.exports.createGroup = ({ faculty_id, program_id, admin_id, group_name, course }) => {
    return executor.execute({
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
            "SELECT * FROM academgroups, faculty, program" +
            "WHERE group_id = ? AND academgroups.faculty_id = faculty.faculty_id AND academgroups.program_id = program.program_id",
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