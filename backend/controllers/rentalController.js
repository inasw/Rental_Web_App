const RentalRequest = require("../model/houseRequestModel");
const House = require("../model/houseModel");

// Renter can initiate a rental request for a specific house
const createRentalRequest = async (req, res) => {
  try {
    // const { houseId, startDate, endDate } = req.body;

    // Find the house by ID
    // const houseId = req.body["house"];
    // console.log(houseId);
    const houseId = req.body.house;
    console.log(houseId);
    const house = await House.findById(houseId);

    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    // Create the rental request
    const rentalRequest = new RentalRequest({
      user: req.body.user,
      house: req.body.house,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: "pending",
    });

    // Save the rental request
    await rentalRequest.save();

    // Add the rental request to the house
    // house.rentalRequests.push(rentalRequest._id);

    // // Save the updated house
    // await house.save();

    res.json({ message: "Rental request created successfully", rentalRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Landlord/Broker receives notifications about new rental requests
// Landlord/Broker can view details of rental requests for their houses
const getRentalRequests = async (req, res) => {
  try {
    const { houseId } = req.params;

    // Find the house by ID
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    // Retrieve the rental requests associated with the house
    const rentalRequests = await RentalRequest.find({ house: houseId });

    res.json({ rentalRequests });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Landlord/Broker can manage rental requests: approve, reject, propose alternative dates
const manageRentalRequest = async (req, res) => {
  try {
    const { houseId, requestId } = req.params;
    const { action, alternativeDates } = req.body;

    // Find the house by ID
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ error: "House not found" });
    }

    // Find the rental request by ID
    const rentalRequest = house.rentalRequests.find(
      (request) => request._id.toString() === requestId
    );
    if (!rentalRequest) {
      return res.status(404).json({ error: "Rental request not found" });
    }

    // Update the rental request based on the action
    if (action === "approve") {
      rentalRequest.status = "rented";
    } else if (action === "reject") {
      rentalRequest.status = "rejected";
    } else if (action === "propose") {
      rentalRequest.alternativeDates = alternativeDates;
      rentalRequest.status = "pending";
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    // Save the updated house
    await house.save();

    res.json({ message: "Rental request updated successfully", rentalRequest });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createRentalRequest,
  getRentalRequests,
  manageRentalRequest,
};
