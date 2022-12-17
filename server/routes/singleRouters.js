// This file contains small routes
const express = require('express');
const router = express.Router();


const listRouter = require('./listRouter');
const subjectRouter = require('./subjectRouter');

router.use('/subjects', subjectRouter);
router.use('/list', listRouter);

module.exports = router;