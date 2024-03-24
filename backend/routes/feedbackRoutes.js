const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getAllFeedbackForHouse,
} = require("../controllers/feedbackController");

router.post("/", submitFeedback);
router.get("/house/:houseId", getAllFeedbackForHouse);

module.exports = router;
