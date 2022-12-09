const executor = require('./executor.js');
const pool = require('../config/config.js');

module.exports.getQuestionsByListId = (listId => {
    return executor.queryExecute({
        query:
            "SELECT * FROM question WHERE list_id = ?",
        params: [listId],
        single: false
    });
});

// module.exports.createQuestion = async ({}) => {
//     connection = await pool.promise().getConnection();
//     await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITED');
//     await connection.beginTransaction();

//     try {
//         await connection.execute(
//             "LOCK TABLE question WRITE",
//             []
//         )

//         await connection.execute(
//             "INSERT INTO question (list_id, edit_date, " +
//             "question_order, question_title, question_body, is_deleted) " +
//             "VALUES (?, ?, ?, ?, ?, ?)",
//             [listId, editDate, questOrder, questTitle, questBody, 0]
//         );

//         let questId = await connection.execute(
//             "SELECT LAST_INSERT_ID()",
//             []
//         )

//         await connection.execute(
//             "INSERT INTO versioned (edit_date, list_id, " +
//             "user_id, question_id, question_order, question_title," + 
//             "question_body, is_deleted) " +
//             "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
//             [listId, editDate, questOrder, questTitle, questBody, 0]
//         );
//     }
// };