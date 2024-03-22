const brokerValidator = (req, res, next) => {
    if (req.user.role === "broker") {
      next();
    } else {
      res.status(403).json({ error: "Protected only for brokers" });
    }
  };
  
  module.exports = {
    brokerValidator,
  };