const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  submitter: {
    type: mongoose.Schema.Types.ObjectId,
   // ref: "User",
    required: true,
  },
  houseEntity: {
    type: mongoose.Schema.Types.ObjectId,
  //  ref: "HouseEntity",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
