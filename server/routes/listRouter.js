const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController.js');

router.get('/public/:subject_id', listController.getPublicBySubjectId);
router.get('/list/:list_id', listController)

module.exports = router;