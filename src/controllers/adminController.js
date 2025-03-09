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
    email, // Add email field
    password, // Add password field
  } = req.body;

  try {
    // Validate numeric fields
    const validatedCapacity = parseInt(capacity);
    const validatedLength = parseFloat(length);
    const validatedWidth = parseFloat(width);

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // Hash with a salt factor of 10

    if (req.files && req.files.length > 0) {
      // Save images to the Image model and Cloudinary
      const imageUrls = [];
      for (const file of req.files) {
        const newImage = new Image({
          url: file.path,
          filename: file.filename,
        });
        await newImage.save();
        imageUrls.push(newImage._id);
      }

      // Create a new Admin object with the image references and hashed password
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
        fileName: imageUrls, // Store array of Image IDs
        agreeTerms,
        email, // Store email
        password: hashedPassword, // Store hashed password
      });

      // Save the admin object to the database
      await newAdmin.save();

      // Send response without the password in it
      res.status(201).json({
        message: "Admin registered successfully!",
        admin: {
          name: newAdmin.name,
          idNumber: newAdmin.idNumber,
          futsalName: newAdmin.futsalName,
          address: newAdmin.address,
          dayRate: newAdmin.dayRate,
          nightRate: newAdmin.nightRate,
          capacity: newAdmin.capacity,
          length: newAdmin.length,
          width: newAdmin.width,
          specification: newAdmin.specification,
          fileName: newAdmin.fileName,
          agreeTerms: newAdmin.agreeTerms,
          email: newAdmin.email, // Do not send password
        },
      });
    } else {
      return res.status(400).json({ message: "Please upload at least one image." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(password); // assuming comparePassword is defined in your model

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT token with payload
    const payload = {
      email: admin.email,
      id: admin._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
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
