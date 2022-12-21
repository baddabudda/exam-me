const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController.js');
const authHandler = require('../utils/authHandler.js');
const questionController = require('../controllers/questionController.js');

const questionRouter = require('./questionRouter')
// get all public lists

router.get('/public/subject/:subjectid', listController.getPublicBySubjectId_get);
// access questions of public list
router.get('/:listid', authHandler ,listController.getListById);
router.get('/public/:listid', listController.getListById);
router.get('/public/:listid/all', questionController.getPublicQuestions_get);
// get access to private group list

router.use('/:listid', questionRouter);
router.use('/public/:listid/', questionRouter);

router.post('/:groupid/create-list', authHandler, listController.createList_post);
router.post('/:groupid/:listid/publish', authHandler, listController.publishList_post);

// router.post('/:listid/create', authHandler, questionController.createQuestion_post);

module.exports = router;