const Admin = require("../models/adminModel");
const Image = require("../models/Image");

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
  } = req.body;

  try {
    // Validate numeric fields
    const validatedCapacity = parseInt(capacity);
    const validatedLength = parseFloat(length);
    const validatedWidth = parseFloat(width);

    if (req.file) {
      const newImage = new Image({
        url: req.file.path,
        filename: req.file.filename,
      });
      await newImage.save();

      if (newImage) {
        // Create a new Admin object
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
          fileName: newImage ? newImage._id : null,
          agreeTerms,
        });

        // Save the admin object to the database
        await newAdmin.save();
      }

      res.status(201).json({ message: "Admin registered successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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
