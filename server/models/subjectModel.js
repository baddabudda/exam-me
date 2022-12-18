// importing query executor
const executor = require('./executor.js');
const { pool } = require('../config/config.js');

// getting specific subject by subject_id
module.exports.getSubjectById = (subjId) => {
    return executor.execute({
        query:
            "SELECT * FROM subjects WHERE subject_id = ?",
        params: [subjId],
        single: true
    });
};

// getting all subjects from table subjects
module.exports.getAllSubjects = () => {
    return executor.execute({
        query:
            "SELECT * FROM subjects",
        params: [],
        single: false
    });
};

// adding subject
module.exports.createSubject = async (sub_name) => {
    let connection = await pool.promise().getConnection();
    let subject = await executor.execute({
        connection: connection,
        query:
            "SELECT * FROM subjects WHERE subject_name=?",
        params: [sub_name],
        single: true
    });
    console.log('there is not such subject in db. subject:', subject)
    if(!!subject){
        throw {code: 409, message: 'this subject name is already exist!'};
    }
    let new_subject = await executor.execute({
        connection: connection,
        query:
            "INSERT INTO subjects (subject_name) value (?)",
        params: [sub_name],
        single: true
    });
    connection.release();
    return new_subject
};

//deleting subject
module.exports.deleteSubjectById = (subjId) => {
    return executor.execute({
        query:
            "DELETE FROM subjects WHERE subject_id = ?",
        params: [subjId],
        single: true
    });
};

//changing subject
module.exports.putSubjectById = async ({subject_id, subject_name}) => {
    let connection = await pool.promise().getConnection();
    let subject = await executor.execute({
        connection: connection,
        query:
            "SELECT * FROM subjects WHERE subject_id=?",
        params: [subject_id],
        single: true
    });
    if(!subject){
        throw {code: 404, message: 'this subject does not exist!'};
    }

    let new_sub = await executor.execute({
        connection: connection,
        query:
            "UPDATE subjects SET subject_name = ?",
        params: [subject_name],
        single: true
    });
    connection.release();
    return new_sub
};