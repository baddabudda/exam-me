// library dependencies
const express = require('express');
const router = express.Router();
// local dependencies
const authHandler = require('../utils/authHandler.js');
const questionController = require('../controllers/questionController.js');

// exam.me/list/all - show all questions
router.get('/all', authHandler, questionController.getAllQuestions_get);
// exam.me/list/:questionid - show specific question
router.get('/:questionid', authHandler, questionController.getQuestion_get);
// exam.me/list/create
router.post('/create', authHandler, questionController.createQuestion_post);
// exam.me/list/:questionid/edit
router.post('/:questionid/edit', authHandler, questionController.editQuestion_post);
// exam.me/list/:questionid
router.delete('/:questionid', authHandler, questionController.deleteQuestion_delete);

module.exports = router;