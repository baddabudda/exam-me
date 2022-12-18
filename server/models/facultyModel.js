const executor = require('./executor.js');

module.exports.findFacultyById = ({ faculty_id }) => {
    return executor.execute({
        query:
            "SELECT * FROM faculty WHERE faculty_id = ?",
        params: [faculty_id],
        single: true
    });
}