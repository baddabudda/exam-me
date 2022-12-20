// library dependencies
const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const userController = require('../controllers/userController.js');
const authHandler = require('../utils/authHandler.js');

// === CONTROLLERS ===
const subjectController = require('../controllers/subjectController.js');
//const listController = require()

// subject router
router.get('/subjects', subjectController.getAllSubjects);
// swagger ui thingies
// router.use('/', swaggerUi.serve);
// router.get('/', swaggerUi.setup(swaggerDocument));
// exam.me/join/:token
router.post('/join/:token', authHandler, userController.joinGroup_post);

module.exports = router;