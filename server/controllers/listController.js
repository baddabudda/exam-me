const list = require('../models/listModel.js');
const errorHandler = require('../utils/errorHandler.js');

// get all public lists by subject_id
module.exports.getPublicBySubjectId = async (req, res) => {
    if (!isNan(parseInt(req.params.subject_id))){
        const lists = await list.getPublicBySubjId(req.params.subject_id);
        res.status(200).json({ lists });
    } else {
        const lists = await list.getAllLists();
    }
};


module.exports.getListById_get = async (req, res) => {
    try{
        if (!isNan(parseInt(req.params.list_id))){
            const currentList = await list.getById(req.params.list_id);
            res.status(200).json({ currentList });
        } else {
            throw {code: 400, message: 'list_id is not a number!'};
        }
    } catch (err) {
        errorHandler(res, error);
    }
}