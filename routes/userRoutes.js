// User Routes (userRoutes.js)
const express = require("express");
const router = express.Router();
const { 
  createLandlord,
  updateLandlord,
  deleteLandlord,
  createBroker,
  updateBroker,
  deleteBroker,
  createRenter,
  updateRenter,
  deleteRenter,
  registerUser,
  updateUser,
  deleteUser,
  searchUsers,
  blockUser,
  unblockUser,
} = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Admin Routes
router.post("/landlords", protect, isAdmin, createLandlord);
router.put("/landlords/:id", protect, isAdmin, updateLandlord);
router.delete("/landlords/:id", protect, isAdmin, deleteLandlord);

router.post("/brokers", protect, isAdmin, createBroker);
router.put("/brokers/:id", protect, isAdmin, updateBroker);
router.delete("/brokers/:id", protect, isAdmin, deleteBroker);

router.post("/renters", protect, isAdmin, createRenter);
router.put("/renters/:id", protect, isAdmin, updateRenter);
router.delete("/renters/:id", protect, isAdmin, deleteRenter);

// Public Routes
router.post("/register", protect, isAdmin, registerUser);

// Protected Routes
router.put("/:id", protect, updateUser); // Missing updateUser function
router.delete("/:id", protect, isAdmin, deleteUser); // Missing deleteUser function
router.get("/search", protect, isAdmin, searchUsers); // Missing searchUsers function
router.put("/:id/block", protect, isAdmin, blockUser); // Missing blockUser function
router.put("/:id/unblock", protect, isAdmin, unblockUser); // Missing unblockUser function

module.exports = router;
