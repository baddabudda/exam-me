const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController.js');
const questionController = require('../controllers/questionController.js');
const authHandler = require('../utils/authHandler');

router.get('/public/:subjectid', listController.getPublicBySubjectId);
// router.get('/:listid', listController)

// question-connected routes (e.g. exam.me/list/:listid/:questionid)
router.get('/:listid/:questionid', authHandler, questionController.getQuestion_get);
router.post('/:listid/create', authHandler, questionController.createQuestion_post);
router.post('/:listid/:questionid/edit', authHandler, questionController.editQuestion_post);
router.delete('/:listid/:questionid', authHandler, questionController.deleteQuestion_delete);

module.exports = router;