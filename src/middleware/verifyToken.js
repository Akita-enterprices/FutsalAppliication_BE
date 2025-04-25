const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  // Extract token from headers
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  try {
    // Decode the token using the same secret key (HS256)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user ID (adminId) in request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Token" });
  }
};

module.exports = verifyToken;


