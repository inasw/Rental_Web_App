const express = require('express');
const router = express.Router();
const {
  createUserAccount,
  updateUserAccount,
  deleteUserAccount,
  blockUserAccount,
  unblockUserAccount
} = require('../controllers/accountCreationController');
const { protect } = require('../middleware/authMiddleware');
const { superAdminAuthorization, adminAuthorization } = require('../middleware/roleAuthorizationMiddleware');

// Create user account (accessible to Super Admin and Admin)
router.post('/create', protect, superAdminAuthorization, createUserAccount);

// Update user account (accessible to Super Admin, Admin, Landlord, and Broker)
router.put('/update/:id', protect, updateUserAccount);

// Delete user account (accessible to Super Admin and Admin)
router.delete('/delete/:id', protect, superAdminAuthorization, deleteUserAccount);

// Block user account (accessible to Super Admin and Admin)
router.put('/block/:id', protect, superAdminAuthorization, blockUserAccount);

// Unblock user account (accessible to Super Admin and Admin)
router.put('/unblock/:id', protect, superAdminAuthorization, unblockUserAccount);

module.exports = router;
