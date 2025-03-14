const SuperAdmin = require("../models/superAdminModel");
const jwt = require("jsonwebtoken");

 exports.registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, nicOrPassport, password } = req.body;

    // Check if Super Admin already exists
    const existingAdmin = await SuperAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Super Admin with this email already exists" });
    }

    const existingNIC = await SuperAdmin.findOne({ nicOrPassport });
    if (existingNIC) {
      return res.status(400).json({ message: "NIC or Passport number already registered" });
    }

    // Create new Super Admin
    const newAdmin = new SuperAdmin({ name, email, nicOrPassport, password });
    await newAdmin.save();

    res.status(201).json({ message: "Super Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.superAdminLogin = async (req, res) => {
    console.log("Request Body:", req.body);
  
    const { username, password } = req.body; // Change email to username (email or NIC/Passport)
    console.log("Username:", username);
    console.log("Password:", password);
  
    try {
      // Step 1: Find the admin by email OR NIC/Passport
      const superAdmin = await SuperAdmin.findOne({
        $or: [{ email: username }, { nicOrPassport: username }],
      });
  
      if (!superAdmin) return res.status(401).json({ message: "SuperAdmin not found" });
  
      // Step 2: Compare the password
      const isPasswordValid = await superAdmin.comparePassword(password);
      if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });
  
      // Step 3: Generate JWT Token
      const token = jwt.sign({ superadminId: superAdmin._id, email: superAdmin.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      return res.status(200).json({
        message: "SuperAdmin authenticated successfully",
        token,
        superAdmin: { name: superAdmin.name, email: superAdmin.email, nicOrPassport: superAdmin.nicOrPassport },
      });
    } catch (error) {
      console.error("Error during super admin login:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };


