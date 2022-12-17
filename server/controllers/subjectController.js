const subject = require('../models/subjectModel.js');
const errorHandler = require('../utils/errorHandler.js');

module.exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await subject.getAllSubjects();
        if (!subjects) {
            throw {code: 500, message: 'could not get subjects!'};
        } else {
            res.status(200).json({ subjects });
        }
    } catch (error) {
        errorHandler(res, error);
    };
};