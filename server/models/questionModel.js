const executor = require('./executor.js');

// === QUESTION - LISTS requests ===
module.exports.getQuestionsByListId = ({ listId }) => {
    return executor.execute({
        query:
            "SELECT * FROM question WHERE list_id = ?",
        params: [listId],
        single: false
    });
};

// === QUESTION inner requests ===
module.exports.checkInDatabase = ({ questId, listId }) => {
    return executor.execute({
        query:
            "SELECT * FROM question WHERE question_id = ? AND list_id = ? AND is_deleted = 0",
        params: [questId, listId],
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
}

module.exports.createQuestion = ({ connection, listId, userId, date, order, title, body }) => {
    return executor.execute({
        connection: connection,
        query:
            "INSERT INTO question (list_id, user_id, edit_date, " +
            "question_order, question_title, question_body, is_deleted) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
        params: [listId, userId, date, order, title, body, 0],
        single: true
    });
}

module.exports.selectQuestionForUpdate = ({ connection, questId }) => {
    return executor.execute({
        connection: connection,
        query: 
            "SELECT * FROM question WHERE question_id = ?",
        params: [questId],
        single: true
    });
}

module.exports.updateQuestion = ({ connection, questId, date, order, title, body }) => {
    return executor.execute({
        connection: connection,
        query:
            "UPDATE question SET edit_date = ?, question_order = ?, question_title = ?, question_body = ? WHERE question_id = ?",
        params: [date, order, title, body, questId],
        single: true
    });
}

module.exports.updateOrder = ({ connection, listId, questId, order }) => {
    return executor.execute({
        connection: connection,
        query:
            "UPDATE question SET question_order = ? WHERE question_id = ? AND list_id = ?",
        params: [order, questId, listId],
        single: true
    });
}

module.exports.markDeleted = ({ connection, listId, questId }) => {
    return executor.execute({
        connection: connection,
        query:
            "UPDATE question SET is_deleted = 1 WHERE list_id = ? AND question_id = ?",
        params: [listId, questId],
        single: true
    });
}

// === VERSIONED inner requests ===
module.exports.createVersion = ({ connection, date, listId, userId, questId, title, body }) => {
    return executor.execute({
        connection: connection,
        query:
            "INSERT INTO versioned (edit_date, list_id, " +
            "user_id, question_id, question_title," + 
            "question_body) " +
            "VALUES (?, ?, ?, ?, ?, ?)",
        params: [date, listId, userId, questId, title, body],
        single: true
    });
}

// === QUESTION - VERSIONED requests ===
module.exports.exportToVersion = ({ connection, questId }) => {
    return executor.execute({
        connection: connection,
        query:
            "INSERT INTO versioned (edit_date, list_id, " +
            "user_id, question_id, question_title, " +
            "question_body) SELECT edit_date, list_id, user_id, " +
            "question_id, question_title, question_body FROM question " +
            "WHERE question_id = ?",
        params: [questId],
        single: true
    });
}

module.exports.getVersionsByQuestionId = ({ questId }) => {
    return executor.execute({
        query:
            "SELECT * FROM versioned WHERE question_id = ?",
        params: [questId],
        single: false
    });
}

module.exports.updateFromVersion = ({ connection, questId }) => {
    return executor.execute({
        connection: connection,
        query: 
            "UPDATE question SET "
    })
}