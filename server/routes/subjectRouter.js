const express = require('express');
const router = express.Router();

const subjectController = require('../controllers/subjectController.js');

router.get('/', subjectController.getAllSubjects);

module.exports = router;