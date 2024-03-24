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
  // deleteRenter,
  registerRenter,
  // updateRenter,
  deleteRenter,
  // updateUser,
  // deleteUser,
  searchRenters,
  blockRenter,
  unblockRenter,
} = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Admin Routes
router.post("/landlords", protect, isAdmin, createLandlord);
router.put("/landlords/:id", protect, isAdmin, updateLandlord);
router.delete("/landlords/:id", protect, isAdmin, deleteLandlord);

router.post("/brokers", protect, isAdmin, createBroker);
router.put("/brokers/:id", protect, isAdmin, updateBroker);
router.delete("/brokers/:id", protect, isAdmin, deleteBroker);

// Public Routes
router.post("/renters", protect, isAdmin, registerRenter);

// Protected Routes
router.put("/renters/:id", protect, updateRenter);
router.delete("/renters/:id", protect, isAdmin, deleteRenter);
router.get("/renters/search", protect, isAdmin, searchRenters);
router.put("/renters/:id/block", protect, isAdmin, blockRenter);
router.put("/renters/:id/unblock", protect, isAdmin, unblockRenter);

module.exports = router;
