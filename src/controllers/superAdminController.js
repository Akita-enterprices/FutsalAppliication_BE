const {SuperAdmin,PendingDeletion} = require("../models/superAdminModel");
const jwt = require("jsonwebtoken");
const verifySuperAdmin = require("../middleware/verifyToken");  
const {Court,Admin} = require("../models/adminModel");
const sendEmail = require("../utils/email"); 
const Booking = require('../models/bookingModel');

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

    const newAdmin = new SuperAdmin({ name, email, nicOrPassport, password });
    await newAdmin.save();

    res.status(201).json({ message: "Super Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.superAdminLogin = async (req, res) => {
    console.log("Request Body:", req.body);
  
    const { username, password } = req.body; 
    console.log("Username:", username);
    console.log("Password:", password);
  
    try {
      const superAdmin = await SuperAdmin.findOne({
        $or: [{ email: username }, { nicOrPassport: username }],
      });
  console.log("superAdmin "+superAdmin);
      if (!superAdmin) return res.status(401).json({ message: "SuperAdmin not found" });
  
      const isPasswordValid = await superAdmin.comparePassword(password);
      if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });
  
      const token = jwt.sign(
        {
          superadminId: superAdmin._id,
          email: superAdmin.email,
          role: "SuperAdmin", 
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
    verifySuperAdmin,
  
    async (req, res) => {
      const { token } = req.body;
      console.log("Received token:", token);
  
      if (!token) {
        return res.status(400).json({ message: "Token is required." });
      }
  
      try {
       
        const court = await Court.findOne({ verificationToken: token });
  
        if (!court) {
          console.log(" No court found with this token.");
          return res.status(400).json({ message: "Invalid or expired token." });
        }
  
        court.isVerified = true;
        court.verificationToken = null;
        await court.save();
        console.log(" Court verified:", court.futsalName);
  
       
        const admin = await Admin.findOne({ courts: court._id });
        if (!admin) {
          return res.status(404).json({ message: "Admin not found for this court." });
        }
  
        // 4. Send confirmation email
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
  
        return res.status(200).json({ message: "Court verified successfully." });
  
      } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ message: error.message || "An error occurred while verifying the court." });
      }
    },
  ];
  
  exports.confirmAdminDeletion = async (req, res) => {
    const { token } = req.body;
  
    try {
      const pending = await PendingDeletion.findOne({ token });
      console.log("Pending deletion token:", pending);
  
      if (!pending) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }
  
      const admin = await Admin.findById(pending.adminId);
      console.log("Admin found:", admin);
  
      if (!admin) {
        return res.status(404).json({ message: "Admin not found." });
      }
  
      // Log court IDs
      const courtIds = admin.courts.map(id => id.toString());
      console.log("Checking bookings for courts:", courtIds);
  
      // Find future, non-cancelled bookings
      const existingBookings = await Booking.find({
        court: { $in: admin.courts },
        status: { $ne: 'cancelled' },
        date: { $gte: new Date() } // Assuming `date` is the booking date
      });
  
      console.log("Found bookings:", existingBookings.length);
  
      if (existingBookings.length > 0) {
        return res.status(400).json({
          message: "Cannot delete admin. One or more courts have future bookings."
        });
      }
  
      // Safe to delete
      await Court.deleteMany({ _id: { $in: admin.courts } });
      await Admin.findByIdAndDelete(admin._id);
      await pending.deleteOne();
  
      await sendEmail({
        to: pending.email,
        subject: "Account Deletion Successful",
        text: `Hello,\n\nYour admin account and all associated futsal courts have been successfully deleted.`,
        html: `<p>Hello,</p><p>Your <strong>admin account</strong> and all associated <strong>futsal courts</strong> have been successfully deleted.</p><p>Regards,<br/>Futsal Management Team</p>`
      });
  
      res.status(200).json({ message: "Admin and associated courts deleted successfully." });
  
    } catch (error) {
      console.error("Error during admin deletion:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  
  exports.getAllAdmins = [
    verifySuperAdmin,
   async (req, res) => {
    try {
      console.log("req.user:", req.user);
      if (!req.user || req.user.role !== 'SuperAdmin') {
        return res.status(403).json({ message: "Access denied. Only super admins can view this." });
      }
  
      const admins = await Admin.find().populate({
        path: "courts.fileName",
        model: "Image",
      });
  console.log("admin"+admins);
      res.json(admins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];
  
  


