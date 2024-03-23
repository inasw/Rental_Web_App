const express = require("express");
const router = express.Router();
const {
  createRentalRequest,
  getRentalRequests,
  manageRentalRequest,
} = require("../controllers/rentalController");

// Renter can initiate a rental request for a specific house
router.post("/rental-requests", createRentalRequest);

// Landlord/Broker can view details of rental requests for their houses
router.get("/:houseId", getRentalRequests);

// Landlord/Broker can manage rental requests: approve, reject, propose alternative dates
router.patch(
  "/houses/:houseId/rental-requests/:requestId",
  manageRentalRequest
);

module.exports = router;
