const subject_modele = require('../models/subjectModel.js');
const errorHandler = require('../utils/errorHandler.js');

module.exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await subject_modele.getAllSubjects();
        // if (!subjects) {
        //     throw {code: 500, message: 'could not get subjects!'};
        // } else {
            res.status(200).json( subjects );
            return;
        // }
    } catch (error) {
        console.log(error);
        errorHandler(res, error);
        return;
    };
};

module.exports.createSubject = async (req, res) => {
    try {
        // const new_sub = 
        const subject = await subject_modele.createSubject(req.body.subject_name);
        if (!subject ) {
            throw {code: 500, message: 'could not create subject!'};
        } else {
            res.status(200).json( {"subject_id": parseInt( subject), "subject_name": req.body.subject_name} );
            return;
        }
    } catch (error) {
        console.log(error);
        errorHandler(res, error);
        return;
    };
};

module.exports.deleteSubjectById = async (req, res) => {
    try {
        const subj_delete = await subject_modele.deleteSubjectById (req.params.subject_id);
        if(subj_delete){
            res.status(200).json( subj_delete );}
        else{
            throw {code: 500, message: 'could not delete subject!'};} 
        } catch (error) {
            console.log(error);
            errorHandler(res, error);
            return;
        }
    
}


module.exports.getSubjectById = async (req, res) => {
    try {
        const subject = await subject_modele.getSubjectById (req.params.subject_id);
        if(!!subject){
            res.status(200).json( subject );
            return;
        }
        else{
            throw {code: 500, message: 'could not find subject!'};
        }
    } catch (error) {
        errorHandler(res, error);
        return;
    };
};

module.exports.putSubjectById = async (req, res) => {
    try {
        const subject = await subject_modele.putSubjectById (req.params.subject_id, req.body.subject_name);
        if(subject==0){
            throw{code: 404, message: 'there is no such id!'}
        }
        else{
            res.status(200).json( {"subject_id": parseInt( req.params.subject_id), "subject_name": req.body.subject_name} );
            return
        }
        
    } catch (error) {
        errorHandler(res, error);
        return;
    };
};