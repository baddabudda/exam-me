const list = require('../models/listModel.js');
const errorHandler = require('../utils/errorHandler.js');

module.exports.getPublicBySubjectId = async (req, res) => {
    try{
        if (!isNan(parseInt(req.params.subject_id))){
            const lists = await list.getPublicBySubjId(req.params.subject_id);
            res.status(200).json( lists );
        } else {
            throw {code: 400, message: 'Subject_id is not a number!'};
        }
    }
    catch (err) {
        console.log(err);
        errorHandler(res, err);
    }
};

module.exports.getListById = async (req, res) => {
    try{
        const list_id = req.params.list_id;
        if (!isNan(parseInt(list_id))){
            const currentList = await list.getById(list_id);
            res.status(200).json( currentList );
        } else {
            throw {code: 400, message: 'list_id is not a number!'};
        }
    } catch (err) {
        console.log(err);
        errorHandler(res, err);
    }
}

const isNan = (val) => val === NaN;