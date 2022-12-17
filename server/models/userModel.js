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
    // console.log(id);
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
            "VALUES (?, ?, ?, ?, ?, 0)",
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

// changing status 
module.exports.changeStatus = ({ user_id }) => {
    return executor.execute({
        query:
            "UPDATE users SET status = 1 WHERE user_id = ?",
        params: [user_id],
        single: true
    });
}
// deleteUserById = ({ id }) => {
//     return executor.queryExecute({
//         query:
//             "DELETE FROM users WHERE user_id = ?",
//             params: [id],
//             single: true
//     })
// }