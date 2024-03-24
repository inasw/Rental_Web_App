const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getAllFeedbackForHouse,
  getFeedbackById,
} = require("../controllers/feedbackController");

router.post("/", submitFeedback);
router.get("/house/:houseId", getAllFeedbackForHouse);

module.exports = router;
