const landlordValidator = (req, res, next) => {
    if (req.user.role === "landlord") {
      next();
    } else {
      res.status(403).json({ error: "Protected only for landlords" });
    }
  };
  
  module.exports = {
    landlordValidator,
  };