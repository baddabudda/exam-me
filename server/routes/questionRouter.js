// library dependencies
const express = require('express');
const router = express.Router();
// local dependencies
const authHandler = require('../utils/authHandler.js');
const questionController = require('../controllers/questionController.js');

// exam.me/list/:listid/all - show all questions
router.get('/:listid/all', authHandler, questionController.getAllQuestions_get);
// exam.me/list/:listid/:questionid - show specific question
router.get('/:listid/:questionid', authHandler, questionController.getQuestion_get);
// exam.me/list/:listid/create
router.post('/:listid/create', authHandler, questionController.createQuestion_post);
// exam.me/list/:listid/:questionid/edit
router.post('/:listid/:questionid/edit', authHandler, questionController.editQuestion_post);
// exam.me/list/:listid/:questionid
router.delete('/:listid/:questionid', authHandler, questionController.deleteQuestion_delete);

module.exports = router;