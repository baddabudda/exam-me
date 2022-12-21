const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController.js');
const authHandler = require('../utils/authHandler.js');
const questionController = require('../controllers/questionController.js');

// get all public lists
router.get('/public/:subjectid', listController.getPublicBySubjectId_get);
// access questions of public list
router.get('/public/:listid/all', questionController.getPublicQuestions_get);
// get access to private group list
router.post('/:groupid/create-list', authHandler, listController.createList_post);
//
router.post('/:groupid/:listid/publish', authHandler, listController.publishList_post);
// exam.me/list/:listid/all - show all questions
router.get('/:listid/all', authHandler, questionController.getAllQuestions_get);
// exam.me/list/:listid/:questionid - show specific question
router.get('/:listid/:questionid', authHandler, questionController.getQuestion_get);
// exam.me/list/:listid/create
router.post('/:listid/create-question', authHandler, questionController.createQuestion_post);
// exam.me/list/:listid/:questionid/edit
router.post('/:listid/:questionid/edit', authHandler, questionController.editQuestion_post);
// exam.me/list/:listid/:questionid
router.delete('/:listid/:questionid', authHandler, questionController.deleteQuestion_delete);

module.exports = router;