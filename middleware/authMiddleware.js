const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { renewToken } = require("../utils/generateToken");

const protect = async (req, res, next) => {
  try {
    let accessToken = req.cookies ? req.cookies.accessToken : undefined;

    if (!accessToken) {
      const { exist, id } = renewToken(req, res);
      if (exist) {
        accessToken = req.cookies.accessToken;
      } else {
        res.status(401);
        throw new Error("You are not logged in");
      }
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401);
    next(error); // Pass the error to the error handling middleware
  }
};

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
