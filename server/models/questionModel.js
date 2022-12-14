const executor = require('./executor.js');
// const pool = require('../config/config.js');

module.exports.getQuestionsByListId = ({ listId }) => {
    return executor.execute({
        query:
            "SELECT * FROM question WHERE list_id = ?",
        params: [listId],
        single: false
    });
};

module.exports.checkInDatabase = ({ questId }) => {
    return executor.execute({
        query:
            "SELECT * FROM question WHERE question_id = ?",
        params: [questId],
        single: true
    })
}

module.exports.checkOrder = ({ listId, order }) => {
    return executor.execute({
        query:
            "SELECT * FROM question WHERE list_id = ? AND question_order = ?",
        params: [listId, order],
        single: true
    });
};

module.exports.createQuestion = ({ connection, listId, userId, date, order, title, body}) => {
    return executor.execute({
        connection: connection,
        query:
            "INSERT INTO question (list_id, user_id, edit_date, " +
            "question_order, question_title, question_body, is_deleted) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
        params: [listId, userId, date, order, title, body, 0],
        single: true
    });
};

module.exports.createVersion = ({connection, date, listId, userId, questId, title, body}) => {
    return executor.execute({
        connection: connection,
        query:
            "INSERT INTO versioned (edit_date, list_id, " +
            "user_id, question_id, question_title," + 
            "question_body, is_deleted) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
        params: [date, listId, userId, questId, title, body],
        single: true
    });
};