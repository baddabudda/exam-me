const executor = require('./executor.js');

module.exports.findProgramById = ({ program_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM program WHERE program_id = ?",
        params: [program_id],
        single: true
    });
}