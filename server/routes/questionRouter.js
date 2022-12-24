// library dependencies
const express = require('express');
const router = express.Router();
// local dependencies
const authHandler = require('../utils/authHandler.js');
const questionController = require('../controllers/questionController.js');

// exam.me/list/:listid/all - show all questions
router.get('/all', authHandler, questionController.getAllQuestions_get); 
// exam.me/list/:listid/:questionid - show specific question
router.get('/:questionid', authHandler, questionController.getQuestion_get);
// exam.me/list/:listid/:questionid/versions
router.get('/:questionid/versions', authHandler, questionController.getVersions_get); // OK, tested
router.put('/:questionid/:versionid', authHandler, questionController.chooseVersion_put); // OK, tested
// exam.me/list/:listid/create
router.post('/create', authHandler, questionController.createQuestion_post);
// exam.me/list/:listid/:questionid/edit
router.put('/:questionid/edit', authHandler, questionController.editQuestion_put);
// exam.me/list/:listid/:questionid
router.delete('/:questionid', authHandler, questionController.deleteQuestion_delete);

router.put('/order_edit', authHandler, questionController.changeOrder_post);

module.exports = router;