const executor = require('./executor.js');

module.exports.search = ({ substring }) => {
    return executor.execute({
        query:
            "SELECT * FROM question WHERE list_id IN (SELECT list_id FROM lists WHERE is_public = 1) AND question.question_title LIKE ? AND question.is_deleted = 0",
        params: [substring],
        single: false
    });
}