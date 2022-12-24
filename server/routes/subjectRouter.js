const express = require('express');
const router = express.Router();

const subjectController = require('../controllers/subjectController.js');

router.route('/')
    .get(subjectController.getAllSubjects)
    .post(subjectController.createSubject)
router.route('/:subject_id')
    .get(subjectController.getSubjectById)
    .put(subjectController.putSubjectById)
    .delete(subjectController.deleteSubjectById)

module.exports = router;