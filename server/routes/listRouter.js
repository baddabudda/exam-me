const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController.js');
const questionRouter = require('./questionRouter')

router.route('/public/:subject_id')
    .get(listController.getPublicBySubjectId)

router.route('/:list_id')
    .get(listController.getListById)

router.use('/:list_id/', questionRouter);

module.exports = router;