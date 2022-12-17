// importing query executor
const executor = require('./executor.js');

// getting specific subject by subject_id
module.exports.getSubjectById = (subjId => {
    return executor.execute({
        query:
            "SELECT * FROM subjects WHERE subject_id = ?",
        params: [subjId],
        single: true
    });
});

// getting all subjects from table subjects
module.exports.getAllSubjects = () => {
    return executor.execute({
        query:
            "SELECT * FROM subjects",
        params: [],
        single: false
    });
};