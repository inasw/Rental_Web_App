const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  houseEntity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HouseEntity",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
