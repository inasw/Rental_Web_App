const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { renewToken } = require("../utils/generateToken");

const protect = asyncHandler(async (req, res, next) => {
  let accessToken = req.cookies.accessToken;

  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      const { exist, id } = renewToken(req, res);
      if (exist) {
        req.user = await User.findById(id).select("-password");
        next();
      } else {
        res.status(401);
        throw new Error("You are not logged in");
      }
    }
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

const permittedTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("You don't have permission to perform this action");
    }

    next();
  };
};

module.exports = { protect, permittedTo };
