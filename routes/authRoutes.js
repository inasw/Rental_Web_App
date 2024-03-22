const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Login route
router.post('/login', authController.login);

// Super Admin route example
router.post('/create-admin', authMiddleware.authenticateRole(['SuperAdmin']), authController.createAdmin);

module.exports = router;
