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
    let check= await executor.execute({
        query:
            "SELECT * FROM subjects WHERE subject_name=?",
        params: [sub_name],
        single: true
    });
    if (check==undefined || check.length==0){0}

    else{
        throw{code: 409, message: 'this subject name is already exist!'}
    }
    const res = await executor.execute({
        query: "INSERT INTO subjects (subject_name) VALUES(?)",
        params: [sub_name],
        single: false
    });
    return(res.insertId);
};

//deleting subject
module.exports.deleteSubjectById = async (subjId) => {
    let check= await executor.execute({
        query:
            "SELECT * FROM subjects WHERE subject_id=?",
        params: [subjId],
        single: true
    });
    if (check==undefined || check.length==0){throw{code: 404, message: 'there is no such id!'}}
    let res = await  (executor.execute({
        query:
            "DELETE FROM subjects WHERE subject_id = ?",
        params: [subjId],
        single: false
    }))
    return {"subject_id": parseInt( subjId), "subject_name": check.subject_name};
};

//changing subject
module.exports.putSubjectById = async (subject_id, subject_name) => {
    let check= await executor.execute({
        query:
            "SELECT * FROM subjects WHERE subject_name=?",
        params: [subject_name],
        single: true
    });
    if (!!check){
        throw{code: 400, message: 'ER_DUP_ENTRY'}
    }
    let new_sub = await executor.execute({
        query:
            "UPDATE subjects SET subject_name = ? WHERE subject_id= ?",
        params: [subject_name, subject_id],
        single: false
    });
    return new_sub.affectedRows
};