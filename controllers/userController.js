const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Renter = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Controller to register a new renter
const registerRenter = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if email is unique
  const existingRenter = await Renter.findOne({ email });
  if (existingRenter) {
    res.status(400).json({ error: "Email already exists" });
    return;
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the new renter
  const renter = await Renter.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json({
    _id: renter._id,
    name: renter.name,
    email: renter.email,
    role: renter.role,
    token: generateToken(renter._id),
  });
});

// Controller to update renter information
const updateRenter = asyncHandler(async (req, res) => {
  const renterId = req.params.id;
  const { name, email, password } = req.body;

  // Find the renter by ID
  const renter = await Renter.findById(renterId);
  if (!renter) {
    res.status(404).json({ error: "Renter not found" });
    return;
  }

  // Update renter information
  renter.name = name || renter.name;
  renter.email = email || renter.email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    renter.password = await bcrypt.hash(password, salt);
  }

  const updatedRenter = await renter.save();
  res.json({
    _id: updatedRenter._id,
    name: updatedRenter.name,
    email: updatedRenter.email,
    role: updatedRenter.role,
  });
});

// Controller to delete renter account
const deleteRenter = asyncHandler(async (req, res) => {
  const renterId = req.params.id;

  // Find the renter by ID
  const renter = await Renter.findById(renterId);
  if (!renter) {
    res.status(404).json({ error: "Renter not found" });
    return;
  }

  // Delete the renter
  await renter.remove();
  res.json({ message: "Renter deleted successfully" });
});

// Controller to search and filter renters
const searchRenters = asyncHandler(async (req, res) => {
  const { role, name, email } = req.query;
  let query = {};

  if (role) query.role = role;
  if (name) query.name = { $regex: name, $options: "i" };
  if (email) query.email = { $regex: email, $options: "i" };

  const renters = await Renter.find(query);
  res.json(renters);
});

// Controller to block a renter
const blockRenter = asyncHandler(async (req, res) => {
  const renterId = req.params.id;

  // Find the renter by ID
  const renter = await Renter.findById(renterId);
  if (!renter) {
    res.status(404).json({ error: "Renter not found" });
    return;
  }

  // Block the Renter
  renter.blocked = true;
  await renter.save();
  res.json({ message: "Renter blocked successfully" });
});

// Controller to unblock a renter
const unblockRenter = asyncHandler(async (req, res) => {
  const renterId = req.params.id;

  // Find the renter by ID
  const renter = await Renter.findById(renterId);
  if (!renter) {
    res.status(404).json({ error: "Renter not found" });
    return;
  }

  // Unblock the renter
  renter.blocked = false;
  await renter.save();
  res.json({ message: "Renter unblocked successfully" });
});

// Controller to create a new landlord
const createLandlord = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const landlord = await User.create({
    name,
    email,
    password,
    role: "landlord", // Assuming the role for a landlord is "landlord"
  });

  res.status(201).json({
    _id: landlord._id,
    name: landlord.name,
    email: landlord.email,
    role: landlord.role,
  });
});

// Controller to update a landlord
const updateLandlord = asyncHandler(async (req, res) => {
  const landlordId = req.params.id;
  const { name, email, password } = req.body;

  const landlord = await User.findById(landlordId);
  if (!landlord) {
    res.status(404).json({ error: "Landlord not found" });
    return;
  }

  landlord.name = name || landlord.name;
  landlord.email = email || landlord.email;
  if (password) {
    landlord.password = password;
  }

  const updatedLandlord = await landlord.save();
  res.json({
    _id: updatedLandlord._id,
    name: updatedLandlord.name,
    email: updatedLandlord.email,
    role: updatedLandlord.role,
  });
});

// Controller to delete a landlord
const deleteLandlord = asyncHandler(async (req, res) => {
  const landlordId = req.params.id;

  const landlord = await User.findById(landlordId);
  if (!landlord) {
    res.status(404).json({ error: "Landlord not found" });
    return;
  }

  await landlord.remove();
  res.json({ message: "Landlord deleted successfully" });
});

// Controller to create a new broker
const createBroker = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const broker = await User.create({
    name,
    email,
    password,
    role: "broker", // Assuming the role for a broker is "broker"
  });

  res.status(201).json({
    _id: broker._id,
    name: broker.name,
    email: broker.email,
    role: broker.role,
  });
});

// Controller to update a broker
const updateBroker = asyncHandler(async (req, res) => {
  const brokerId = req.params.id;
  const { name, email, password } = req.body;

  const broker = await User.findById(brokerId);
  if (!broker) {
    res.status(404).json({ error: "Broker not found" });
    return;
  }

  broker.name = name || broker.name;
  broker.email = email || broker.email;
  if (password) {
    broker.password = password;
  }

  const updatedBroker = await broker.save();
  res.json({
    _id: updatedBroker._id,
    name: updatedBroker.name,
    email: updatedBroker.email,
    role: updatedBroker.role,
  });
});

// Controller to delete a broker
const deleteBroker = asyncHandler(async (req, res) => {
  const brokerId = req.params.id;

  const broker = await User.findById(brokerId);
  if (!broker) {
    res.status(404).json({ error: "Broker not found" });
    return;
  }

  await broker.remove();
  res.json({ message: "Broker deleted successfully" });
});

module.exports = {
  registerRenter,
  updateRenter,
  deleteRenter,
  searchRenters,
  blockRenter,
  unblockRenter,
  createLandlord,
  updateLandlord,
  deleteLandlord,
  createBroker,
  updateBroker,
  deleteBroker,
};
