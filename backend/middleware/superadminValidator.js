const superadminValidator = (req, res, next) => {
    if (req.user.role === "superadmin") {
      next();
    } else {
      res.status(403).json({ error: "Protected only for superadmin" });
    }
  };
  
  module.exports = {
    superadminValidator,
  };