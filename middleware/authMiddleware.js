// Authentication Middleware (authMiddleware.js)
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  // Get the token from the request headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Fetch the user associated with the token
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Not authorized, token failed" });
      return; // Return to exit the middleware
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  // Check if the current user is an admin or super admin
  if (req.user && (req.user.role === "admin" || req.user.role === "SuperAdmin")) {
    next();
  } else {
    res.status(403).json({ error: "Not authorized as an admin" });
  }
});

module.exports = { protect, isAdmin };
