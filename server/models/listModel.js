// importing query executor
const executor = require('./executor.js');
const pool = require('../config/config.js');

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
