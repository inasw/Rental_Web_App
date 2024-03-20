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

module.exports = {
  registerUser,
  updateUser,
  deleteUser,
  searchUsers,
  blockUser,
  unblockUser,
};
