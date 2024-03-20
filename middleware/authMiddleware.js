// Authentication Middleware (authMiddleware.js)
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  // Implement authentication logic here
});

const isAdmin = (req, res, next) => {
  // Implement admin authorization logic here
};

module.exports = { protect, isAdmin };
