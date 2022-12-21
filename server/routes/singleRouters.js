// library dependencies
const express = require('express');
const router = express.Router();
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('../swagger.json');
const listRouter = require('./listRouter');
const subjectRouter = require('./subjectRouter');
const profileRouter = require('./profileRouter')
const groupRouter = require('./groupRouter');

// === CONTROLLERS ===
const subjectController = require('../controllers/subjectController.js');
//const listController = require()

// subject router
// router.get('/subjects', subjectController.getAllSubjects);
// swagger ui thingies
// router.use('/', swaggerUi.serve);
// router.get('/', swaggerUi.setup(swaggerDocument));

router.use('/subjects', subjectRouter);
router.use('/lists', listRouter);
router.use('/profile', profileRouter);
router.use('/group', groupRouter);

module.exports = router;