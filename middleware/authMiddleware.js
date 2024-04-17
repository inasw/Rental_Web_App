const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { renewToken } = require("../utils/generateToken");

const protect = asyncHandler(async (req, res, next) => {
  let accessToken;
  accessToken = req.cookies.accessToken;
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!accessToken) {
    const { exist, id } = renewToken(req, res);
    if (exist) {
      req.user = await User.findById(id).select("-password");
      next();
    } else {
      res.status(401);
      throw new Error("you are not logged in");
    }
  }
});

const permittedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("You don't have permission to perform this action");
    }

    next();
  };
};

module.exports = { protect, permittedTo };
