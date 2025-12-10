const express = require('express');
const router = express.Router();
const authUser = require('../middleware/authUser');
const userController = require('../controllers/userController');

router.put('/preferences', authUser, userController.updatePreferences);

module.exports = router;