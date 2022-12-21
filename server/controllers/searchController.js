const searchModel = require('../models/searchModel.js');
const errorHandler = require('../utils/errorHandler');

module.exports.search_get = async (req, res) => {
    try {
        let query = req.query.question;
        let substring = '%'.concat(query.concat('%'));
        let results = await searchModel.search({ substring: substring });
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        // errorHandler({ res: res, code: 500, error: error.mesage });
    }
}