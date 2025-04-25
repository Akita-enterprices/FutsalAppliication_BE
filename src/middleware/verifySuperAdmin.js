const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifySuperAdmin = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer token
  
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.role !== "SuperAdmin") {
        return res.status(403).json({ message: "Forbidden. Only Super Admin can verify." });
      }
  
      req.superAdminId = decoded.superadminId;  // Store SuperAdmin ID in request
      next();
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
  };
  
  module.exports = verifySuperAdmin;