const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Token not found");
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Invalid token");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = { authentication };
