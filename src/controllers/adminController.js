const Admin = require("../models/adminModel");
const Image = require("../models/Image");
const bcrypt = require('bcryptjs'); 
const axios = require("axios");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  const {
    name,
    idNumber,
    futsalName,
    address,
    dayRate,
    nightRate,
    capacity,
    length,
    width,
    specification,
    agreeTerms,
    email,
    password,
  } = req.body;

  try {
    // Ensure numeric fields are valid
    const validatedCapacity = parseInt(capacity);
    const validatedLength = parseFloat(length);
    const validatedWidth = parseFloat(width);

    if (req.files && req.files.length > 0) {
      // Save images to the Image model
      const imageUrls = [];
      for (const file of req.files) {
        const newImage = new Image({ url: file.path, filename: file.filename });
        await newImage.save();
        imageUrls.push(newImage._id);
      }

      // Create new admin (Mongoose will hash password)
      const newAdmin = new Admin({
        name,
        idNumber,
        futsalName,
        address,
        dayRate,
        nightRate,
        capacity: validatedCapacity,
        length: validatedLength,
        width: validatedWidth,
        specification,
        fileName: imageUrls,
        agreeTerms,
        email,
        password, // Store plain password (it will be hashed automatically)
      });

      await newAdmin.save();

      res.status(201).json({
        message: "Admin registered successfully!",
        admin: {
          name: newAdmin.name,
          email: newAdmin.email,
          futsalName: newAdmin.futsalName,
        },
      });
    } else {
      return res.status(400).json({ message: "Please upload at least one image." });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Admin not found" });

    // Step 2: Compare the password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

    // Step 3: Generate JWT Token (Without Auth0 for now)
    const token = jwt.sign({ adminId: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Admin authenticated successfully",
      token,
      admin: { name: admin.name, email: admin.email, futsalName: admin.futsalName },
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};






// GET request to fetch all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().populate("fileName");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET request to fetch a single admin by ID
exports.getAdminById = async (req, res) => {
  const adminId = req.params.id;

  try {
    const admin = await Admin.findById(adminId).populate("fileName");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT request to update an admin by ID
exports.updateAdmin = async (req, res) => {
  const adminId = req.params.id;
  const {
    name,
    idNumber,
    futsalName,
    address,
    dayRate,
    nightRate,
    capacity,
    length,
    width,
    specification,
    agreeTerms,
  } = req.body;

  try {
    // Validate numeric fields
    const validatedCapacity = parseInt(capacity);
    const validatedLength = parseFloat(length);
    const validatedWidth = parseFloat(width);

    // Find the admin by ID and update
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      {
        name,
        idNumber,
        futsalName,
        address,
        dayRate,
        nightRate,
        capacity: validatedCapacity,
        length: validatedLength,
        width: validatedWidth,
        specification,
        agreeTerms,
      },
      { new: true } // To return the updated document
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin updated successfully!", admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE request to delete an admin by ID
exports.deleteAdmin = async (req, res) => {
  const adminId = req.params.id;

  try {
    // Find admin by ID and delete
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





