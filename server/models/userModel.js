const executor = require('./executor.js');

// get user by vk_id
module.exports.getUserByVkId = ({ vk_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM users WHERE vk_id = ?",
        params: [vk_id],
        single: true
    });
}

// get user by id = database id
module.exports.getUserById = ({ user_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM users WHERE user_id = ?",
        params: [user_id],
        single: true
    });
}

// create new user in passport-setup callback function
module.exports.createUser = ({ vk_id, fname, lname }) => {
    return executor.execute({
        query:
            "INSERT INTO users (vk_id, user_fname, user_lname, status) " +
            "VALUES (?, ?, ?, 0)",
        params: [vk_id, fname, lname],
        single: true
    });
}

// edit user info in profile
module.exports.editUser = ({ user_id, fname, lname, pname }) => {
    return executor.execute({
        query: 
            "UPDATE users SET user_fname = ?, user_lname = ?, user_pname = ? WHERE user_id = ?",
        params: [fname, lname, pname, user_id],
        single: true
    });
}

// change status (for registration purposes)
module.exports.changeStatus = ({ user_id }) => {
    return executor.execute({
        query:
            "UPDATE users SET status = 1 WHERE user_id = ?",
        params: [user_id],
        single: true
    });
}

// join group
module.exports.joinGroup = ({ connection, user_id, group_id }) => {
    return executor.execute({
        connection: connection,
        query:
            "UPDATE users SET group_id = ? WHERE user_id = ?",
        params: [group_id, user_id],
        single: true
    });
}

// leave group
module.exports.leaveGroup = ({ user_id }) => {
    return executor.execute({
        query:
            "UPDATE users SET group_id = NULL WHERE user_id = ?",
        params: [user_id],
        single: true
    });
}

// get group members
module.exports.getGroupMembers = ({ group_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM users WHERE group_id = ?",
        params: [group_id],
        single: false
    });
}

// block user: lvl 1 - no edit mode, 2 - no edit/comment
module.exports.blockUser = ({ group_id, user_id, block_level }) => {
    return executor.execute({
        query:
            "INSERT INTO blacklist (user_id, group_id, block_level) VALUES (?, ?, ?)",
        params: [user_id, group_id, block_level],
        single: true
    });
}

// unblock user
module.exports.unblockUser = ({ group_id, user_id }) => {
    return executor.execute({
        query:
            "DELETE FROM blacklist WHERE group_id = ? AND user_id = ?",
        params: [group_id, user_id],
        single: true
    });
}

// сheck in blacklist
module.exports.checkInBlackList = ({ group_id, user_id }) => {
    return executor.execute({
        query:
            "SELECT block_level FROM blacklist WHERE group_id = ? AND user_id = ?",
        params: [group_id, user_id],
        single: true
    });
}