const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  console.log("Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ensure this contains { id: adminId }
    console.log("Decoded Token:", decoded);
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
