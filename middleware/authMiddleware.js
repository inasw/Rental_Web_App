const express=require('express');
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// middleware/authMiddleware.js
exports.checkRole = (role) => {
    return (req, res, next) => {
      if (req.user.role === role) {
        next();
      } else {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    };
  };
  
  // controllers/userController.js
  const User = require('../models/User');
  
  exports.deleteUser = async (req, res) => {
    // Check if the user is SuperAdmin or Admin
    if (req.user.role === 'SuperAdmin' || req.user.role === 'Admin') {
      try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the user' });
      }
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  };
  
  exports.blockUser = async (req, res) => {
    // Check if the user is SuperAdmin or Admin
    if (req.user.role === 'SuperAdmin' || req.user.role === 'Admin') {
      try {
        const { id } = req.params;
        const user = await User.findById(id);
        user.blocked = true;
        await user.save();
        res.json({ message: 'User blocked successfully' });
      } catch (error) {
        res.status(500).json({ message: 'An error occurred while blocking the user' });
      }
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  };
  
  exports.unblockUser = async (req, res) => {
    // Check if the user is SuperAdmin or Admin
    if (req.user.role === 'SuperAdmin' || req.user.role === 'Admin') {
      try {
        const { id } = req.params;
        const user = await User.findById(id);
        user.blocked = false;
        await user.save();
        res.json({ message: 'User unblocked successfully' });
      } catch (error) {
        res.status(500).json({ message: 'An error occurred while unblocking the user' });
      }
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  };
  
  exports.updateProfile = async (req, res) => {
    try {
      const { id } = req.user;
      const { name, email, contactDetails } = req.body;
      const user = await User.findById(id);
      user.name = name;
      user.email = email;
      user.contactDetails = contactDetails;
      await user.save();
      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the profile' });
    }
  };
  // middleware/authMiddleware.js
exports.checkSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Unauthorized. Super Admin access required.' });
    }
    next();
  };
  
  exports.checkAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
    }
    next();
  };
  
  // controllers/authController.js
  const User = require('../models/User');
  
  exports.createAdmin = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const admin = new User({ name, email, password, role });
      await admin.save();
      res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create admin account' });
    }
  };
  
  // routes/authRoutes.js
  const express = require('express');
  const router = express.Router();
  const authController = require('../controllers/authController');
  const authMiddleware = require('../middleware/authMiddleware');
  
  // Create Admin route - Only Super Admin can create Admins
  router.post('/create-admin', authMiddleware.checkSuperAdmin, authController.createAdmin);
  
  module.exports = router;
  