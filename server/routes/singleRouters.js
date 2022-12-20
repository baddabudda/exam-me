// library dependencies
const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// === CONTROLLERS ===
const subjectController = require('../controllers/subjectController.js');
//const listController = require()

// subject router
router.get('/subjects', subjectController.getAllSubjects);
// swagger ui thingies
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

module.exports = router;