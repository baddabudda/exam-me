// library dependencies
const express = require('express');
const router = express.Router();
// local dependencies
const groupController = require('../controllers/groupController.js');
const authHandler = require('../utils/authHandler.js');

// exam.me/group/123
router.get('/:groupid', authHandler, groupController.groupInfo_get);
// exam.me/group/create
router.post('/create', authHandler, groupController.createGroup_post);
// exam.me/group/123/edit
router.put('/:groupid/edit', authHandler, groupController.editGroup_put);
// exam.me/group/123/invite
router.get('/:groupid/invite', authHandler, groupController.generateInvitation_get);

module.exports = router;