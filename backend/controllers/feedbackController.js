const asyncHandler = require("express-async-handler");
const Feedback = require("../models/feedback");

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

