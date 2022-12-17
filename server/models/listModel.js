// importing query executor
const executor = require('./executor.js');
const pool = require('../config/config.js');

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
            "SELECT COUNT(*) FROM lists WHERE list_id = ?",
        params: [listId],
        single: true
    });
}
