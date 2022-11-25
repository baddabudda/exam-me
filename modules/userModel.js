const md5 = require('md5');
const executor = require('./executor.js');
// const pool = require('../config/config.js');

createUser = ({login, password, email, fname, lname, pname}) => {
    return executor.queryExecute({
        query:
            "INSERT INTO users (user_login, password_hash, " +
            "user_email, user_fname, user_lname, user_pname) " +
            "VALUES (?, ?, ?, ?, ?, ?)",
        params: [login, md5(password), email, fname, lname, pname],
        single: true
    });
};

editUser = ({login, email, fname, lname, pname, id}) => {
    return executor.queryExecute({
        query: 
            "UPDATE users SET user_login = ?, user_email = ?, " +
            "user_fname = ?, user_lname = ?, user_pname = ? " +
            "WHERE user_id = ?",
        params: [login, email, fname, lname, pname, id],
        single: true
    });
};

deleteUserByLogin = (login) => {
    return executor.queryExecute({
        query:
            "DELETE FROM users WHERE user_login = ?",
        params: [login],
        single: true
    });
};

deleteUserById = (id) => {
    return executor.queryExecute({
        query:
            "DELETE FROM users WHERE user_id = ?",
            params: [id],
            single: true
    })
};

getUserById = (id) => {
    return executor.queryExecute({
        query:
            "SELECT user_id, group_id, user_login, user_email, " +
            "user_fname, user_lname, user_pname FROM users " +
            "WHERE user_id = ?",
        params: [id],
        single: true
    });
};

getUserByLogin = (login) => {
    return executor.queryExecute({
        query: 
            "SELECT user_id, group_id, user_login, user_email, " +
            "user_fname, user_lname, user_pname FROM users " +
            "WHERE user_login = ?",
        params: [login],
        single: true
    });
};