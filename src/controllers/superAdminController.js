const SuperAdmin = require("../models/superAdminModel");
const jwt = require("jsonwebtoken");
const verifySuperAdmin = require("../middleware/verifyToken");  
const {Admin} = require("../models/adminModel");
const sendEmail = require("../utils/email"); 

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
  
      const token = jwt.sign(
        {
          superadminId: superAdmin._id,
          email: superAdmin.email,
          role: "SuperAdmin",  // Include the role field
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
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



  exports.verifyCourt = [
    verifySuperAdmin, // Ensure SuperAdmin is authenticated before proceeding
  
    async (req, res) => {
      const { token } = req.body; // Token is received in request body
  
      if (!token) {
        return res.status(400).json({ message: "Token is required." });
      }
  
      try {
        // Find the admin who owns the court with the given token
        const admin = await Admin.findOne({ "courts.verificationToken": token });
  
        if (!admin) {
          return res.status(400).json({ message: "Invalid or expired token." });
        }
  
        // Find the specific court that matches the token
        const court = admin.courts.find(court => court.verificationToken === token);
  
        if (!court) {
          return res.status(400).json({ message: "Court not found or already verified." });
        }
  
        // ✅ Verify only this specific court
        court.isVerified = true;
        court.verificationToken = null; // Remove the token after verification
  
        await admin.save();
  
        // 📩 Send confirmation email to the admin
        const emailContent = `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
            <h2 style="color: #333;">Futsal Court Verified</h2>
            <p style="font-size: 16px; color: #555;">
              Dear ${admin.name}, your futsal court <strong>${court.futsalName}</strong> has been successfully verified by the Super Admin.
            </p>
            <p style="color: #777;">You can now start accepting bookings!</p>
          </div>
        `;
  
        await sendEmail(admin.email, "Your Futsal Court is Verified!", emailContent);
  
        res.status(200).json({ message: "Court verified successfully!" });
  
      } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ message: error.message || "An error occurred while verifying the court." });
      }
    },
  ];
  


