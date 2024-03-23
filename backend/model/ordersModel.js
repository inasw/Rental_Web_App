const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
 /* tenantID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },*/
  date: {
    type: Date,
    default: Date.now,
  },
  bidPrice: {
    type: Number,
    required: true,
  },
 /* houseEntityID: {
    type: mongoose.Schema.Types.ObjectId,
   ref: "HouseEntity",
    required: true,
  },*/
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Orders", orderSchema);
