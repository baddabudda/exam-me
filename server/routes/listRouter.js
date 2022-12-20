const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController.js');

router.route('/public/:subject_id')
    .get(listController.getPublicBySubjectId)

router.route('/:list_id')
    .get(listController.getListById)

module.exports = router;