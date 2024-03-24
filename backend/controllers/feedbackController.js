const asyncHandler = require("express-async-handler");
const Feedback = require("../model/feedbackModel");

const submitFeedback = asyncHandler(async (req, res) => {
  const { renter, houseEntity, rating, comment } = req.body;

  const feedback = new Feedback({
    renter,
    houseEntity,
    rating,
    comment,
  });
  await feedback.save();
  res.status(201).json(feedback);
});

const getAllFeedbackForHouse = asyncHandler(async (req, res) => {
  const houseId = req.params.houseId;
  const feedback = await Feedback.find({ houseEntity: houseId });
  res.json(feedback);
});

const getFeedbackById = asyncHandler(async (req, res) => {
  const feedbackId = req.params.id;

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) {
    return res.status(404).json({ message: "Feedback not found" });
  }

  res.json(feedback);
});

module.exports = {
  submitFeedback,
  getAllFeedbackForHouse,
  getFeedbackById,
};
