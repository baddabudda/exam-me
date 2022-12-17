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