// User Routes (userRoutes.js)
const express = require("express");
const router = express.Router();
const {
  registerUser,
  updateUser,
  deleteUser,
  searchUsers,
  blockUser,
  unblockUser,
} = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", protect, isAdmin, registerUser);

// Protected Routes
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, isAdmin, deleteUser);
router.get("/search", protect, isAdmin, searchUsers);
router.put("/:id/block", protect, isAdmin, blockUser);
router.put("/:id/unblock", protect, isAdmin, unblockUser);

module.exports = router;

