const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Corrected file path
const authMiddleware = require('../middleware/authMiddleware'); // Corrected file path

// Login route
router.post('/login', authController.login);

// Super Admin route example
router.post('/create-admin', authMiddleware.authenticateRole(['SuperAdmin']), authController.createAdmin);

module.exports = router;
