const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Controller to register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if email is unique
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ error: "Email already exists" });
    return;
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// Controller to update user information
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Update user information
  user.name = name || user.name;
  user.email = email || user.email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

// Controller to delete user account
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Delete the user
  await user.remove();
  res.json({ message: "User deleted successfully" });
});

// Controller to search and filter users
const searchUsers = asyncHandler(async (req, res) => {
  const { role, name, email } = req.query;
  let query = {};

  if (role) query.role = role;
  if (name) query.name = { $regex: name, $options: "i" };
  if (email) query.email = { $regex: email, $options: "i" };

  const users = await User.find(query);
  res.json(users);
});

// Controller to block a user
const blockUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Block the user
  user.blocked = true;
  await user.save();
  res.json({ message: "User blocked successfully" });
});

// Controller to unblock a user
const unblockUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Unblock the user
  user.blocked = false;
  await user.save();
  res.json({ message: "User unblocked successfully" });
});


  // Controller to create a new landlord
const createLandlord = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if email is unique
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ error: "Email already exists" });
    return;
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the new landlord
  const landlord = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Landlord",
  });

  res.status(201).json({
    _id: landlord._id,
    name: landlord.name,
    email: landlord.email,
    role: landlord.role,
    token: generateToken(landlord._id),
  });
});

// Controller to update a landlord
const updateLandlord = asyncHandler(async (req, res) => {
  const landlordId = req.params.id;
  const { name, email, password } = req.body;

  // Find the landlord by ID
  const landlord = await User.findById(landlordId);
  if (!landlord) {
    res.status(404).json({ error: "Landlord not found" });
    return;
  }

  // Update landlord information
  landlord.name = name || landlord.name;
  landlord.email = email || landlord.email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    landlord.password = await bcrypt.hash(password, salt);
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

  // Find the landlord by ID
  const landlord = await User.findById(landlordId);
  if (!landlord) {
    res.status(404).json({ error: "Landlord not found" });
    return;
  }

  // Delete the landlord
  await landlord.remove();
  res.json({ message: "Landlord deleted successfully" });
});

// Controller to create a new broker
const createBroker = asyncHandler(async (req, res) => {
  // Implementation code for creating a new broker
});

// Controller to update a broker
const updateBroker = asyncHandler(async (req, res) => {
  // Implementation code for updating a broker
});

// Controller to delete a broker
const deleteBroker = asyncHandler(async (req, res) => {
  // Implementation code for deleting a broker
});

// Controller to create a new renter
const createRenter = asyncHandler(async (req, res) => {
  // Implementation code for creating a new renter
});

// Controller to update a renter
const updateRenter = asyncHandler(async (req, res) => {
  // Implementation code for updating a renter
});

// Controller to delete a renter
const deleteRenter = asyncHandler(async (req, res) => {
  // Implementation code for deleting a renter
});

module.exports = {
  registerUser,
  updateUser,
  deleteUser,
  searchUsers,
  blockUser,
  unblockUser,
  createLandlord,
  updateLandlord,
  deleteLandlord,
  createBroker,
  updateBroker,
  deleteBroker,
  createRenter,
  updateRenter,
  deleteRenter
};
