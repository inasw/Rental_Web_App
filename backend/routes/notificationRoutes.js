const express = require("express");
const {
  createNotification,
  getNotificationsByUserId,
} = require("../controllers/notificationController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// POST /notifications
router.post("/", protect, createNotification);
router.get("/:userId", getNotificationsByUserId);

module.exports = router;
