const jwt = require("jsonwebtoken");

const generateToken = (res, id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "2m",
  });
  const refreshToken = jwt.sign({ id }, process.env.REF_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("accessToken", accessToken, {
    maxAge: 120000, // 2 minutes in milliseconds
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
};

const renewToken = (req, res) => {
  const refreshToken = req.cookies ? req.cookies.refreshToken : undefined;
  let exist = false;
  let id;
  
  if (!refreshToken) {
    res.status(401);
    throw new Error("You haven't logged in or don't have a refresh token");
  } else {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REF_TOKEN_SECRET);
      id = decoded.id;
      const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "2m",
      });

      res.cookie("accessToken", accessToken, {
        maxAge: 120000, // 2 minutes in milliseconds
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
      
      console.log("Refresh token success");
      exist = true;
    } catch (error) {
      res.status(401);
      throw new Error("Refresh token failed");
    }
  }
  
  return { exist, id };
};

module.exports = { generateToken, renewToken };
