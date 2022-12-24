const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityControllers.js');
const authHandler = require('../utils/authHandler.js');

router.get('/faculty/all', authHandler, universityController.allFaculties_get);
router.get('/program/all', authHandler, universityController.allPrograms_get);

module.exports = router;