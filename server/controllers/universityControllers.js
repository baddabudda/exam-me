const facultyModel = require('../models/facultyModel.js');
const programModel = require('../models/programModel.js');
const errorHandler = require('../utils/errorHandler.js');

module.exports.allFaculties_get = async (req, res) => {
    try {
        let faculties = await facultyModel.selectAllFaculties();
        res.status(200).json(faculties);
    } catch (error) {
        errorHandler({ res: res, code: 500, error: error.message });
    }

}

module.exports.allPrograms_get = async (req, res) => {
    try {
        let programs = await programModel.selectAllPrograms();
        res.status(200).json(programs);
    } catch (error) {
        errorHandler({ res: res, code: 500, error: error.message });
    }
}
// module.exports.programsByFaculty_get = async (req, res) => {
//     try {
//         let programs = await programModel.selectAllPrograms();
//         res.status(200).json(programs);
//     } catch (error) {
//         errorHandler({ res: res, code: 500, error: error.message });
//     }
// }