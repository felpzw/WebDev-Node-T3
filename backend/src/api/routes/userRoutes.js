const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authUser = require('../middleware/authUser'); 

router.put('/preferences', authUser, userController.updatePreferences);

module.exports = router;