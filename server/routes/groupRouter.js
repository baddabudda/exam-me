// library dependencies
const express = require('express');
const router = express.Router();
// local dependencies
const groupController = require('../controllers/groupController.js');
const authHandler = require('../utils/authHandler.js');

// exam.me/group/123
router.get('/:group_id', authHandler, groupController.groupInfo_get);
// exam.me/group/create
router.post('/create', authHandler, groupController.createGroup_post);
// exam.me/group/123/edit
router.post('/:group_id/edit', authHandler, groupController.editGroup_post);
// exam.me/group/123/invite
router.get('/:group_id/invite', authHandler, groupController.generateInvitation_get);
module.exports = router;