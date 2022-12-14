// This file contains small routes
const express = require('express');
const router = express.Router();

// === CONTROLLERS ===
const subjectController = require('../controllers/subjectController.js');
//const listController = require()

// subject router
router.get('/subjects', subjectController.getAllSubjects);

module.exports = router;