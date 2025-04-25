const { Admin, Court } = require("../models/adminModel");
const Image = require("../models/Image");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

exports.registerAdmin = async (req, res) => {
  const {
    name,
    idNumber,
    email,
    password,
    nicOrPassport,
    futsalName,
    address,
    dayRate,
    nightRate,
    capacity,
    length,
    width,
    specification,
    agreeTerms,
    sports,
  } = req.body;

  try {
    // Convert agreeTerms to Boolean
    const agreeTermsBoolean = agreeTerms === "true" || agreeTerms === true;

    // Validate required fields
    if (
      !name || !idNumber || !email || !password || !nicOrPassport ||
      !futsalName || !address || !dayRate || !nightRate ||
      !capacity || !length || !width || !specification || !agreeTermsBoolean ||
      !sports || !Array.isArray(sports) || sports.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Ensure numeric fields are valid
    const validatedCapacity = isNaN(parseInt(capacity)) ? 0 : parseInt(capacity);
    const validatedLength = isNaN(parseFloat(length)) ? 0 : parseFloat(length);
    const validatedWidth = isNaN(parseFloat(width)) ? 0 : parseFloat(width);

    const validSports = ['cricket', 'football', 'tennis'];
    const invalidSports = sports.filter((s) => !validSports.includes(s));
    if (invalidSports.length > 0) {
      return res.status(400).json({ message: `Invalid sport(s): ${invalidSports.join(", ")}` });
    }

    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image." });
    }

    // Save images to the Image model
    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const newImage = new Image({ url: file.path, filename: file.filename });
        await newImage.save();
        return newImage._id;
      })
    );

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    console.log("Generated Verification Token:", verificationToken);

    // Create new admin with courts array
    const newAdmin = new Admin({
      name,
      email,
      password, // Auto-hashed by Mongoose middleware
      nicOrPassport,
      courts: [
        {
          futsalName,
          idNumber,
          address,
          dayRate,
          nightRate,
          capacity: validatedCapacity,
          length: validatedLength,
          width: validatedWidth,
          specification,
          fileName: imageUrls,
          sports,
          agreeTerms: agreeTermsBoolean,
          isVerified: false,
          verificationToken,
        },
      ],
    });

    console.log("Before Saving Admin:", newAdmin);
    await newAdmin.save();

    console.log("After Saving Admin:", await Admin.findById(newAdmin._id));

    // Send verification email to Super Admin
    const verificationLink = `${process.env.CLIENT_URL}/admin/verify?token=${verificationToken}`;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
        <h2 style="color: #333;">New Admin Registration</h2>
        <p style="font-size: 16px; color: #555;">
          A new admin has registered for the futsal booking system. Please review and verify their registration by clicking the button below:
        </p>
        <div style="margin: 20px 0;">
          <a href="${verificationLink}" 
             style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
             Verify Admin
          </a>
        </div>
        <p style="color: #777;">If you did not request this, you can ignore this email.</p>
      </div>
    `;

    await sendEmail(process.env.SUPER_ADMIN_EMAIL, "Verify New Admin", emailContent);

    const adminEmailContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
      <h2 style="color: #333;">Registration Successful</h2>
      <p style="font-size: 16px; color: #555;">
        Dear ${name}, your registration for ${futsalName} has been received.
      </p>
      <p style="font-size: 16px; color: #555;">
        Your account is currently pending verification by the Super Admin. You will receive a notification once your account has been approved.
      </p>
      <p style="color: #777;">If you have any questions, please contact our support team.</p>
    </div>
  `;

    await sendEmail(email, "Futsal Booking System - Registration Received", adminEmailContent);

    res.status(201).json({
      message: "Admin registered successfully! Pending Super Admin verification.",
      admin: {
        name: newAdmin.name,
        email: newAdmin.email,
        nicOrPassport: newAdmin.nicOrPassport,
        futsalName: newAdmin.courts[0].futsalName,
        verificationToken: newAdmin.courts[0].verificationToken,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
};


// Admin Login
exports.adminLogin = async (req, res) => {
  console.log("Request Body:", req.body);

  const { username, password } = req.body;
  console.log("Username:", username);
  console.log("Password:", password);

  try {
    // Find the admin by email OR NIC/Passport
    const admin = await Admin.findOne({ $or: [{ email: username }, { nicOrPassport: username }] });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if any of the admin's courts are verified
    const hasVerifiedCourt = admin.courts.some(court => court.isVerified === true);

    if (!hasVerifiedCourt) {
      return res.status(403).json({ message: "Your account is pending verification by the Super Admin." });
    }


    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log("Incorrect password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Password matched!");

    // Generate JWT Token
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

// Change Admin Password
exports.changeAdminPassword = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }

    const adminId = decoded.adminId;
    if (!adminId) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    const { oldPassword, newPassword } = req.body;

    // Find admin by ID
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare the old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password should be at least 8 characters long" });
    }

    // Update password (Mongoose `pre("save")` middleware will hash it)
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Error in changeAdminPassword:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.addCourt = async (req, res) => {
  try {
    const { futsalName, idNumber, address, dayRate, nightRate, capacity, length, width, specification, agreeTerms, sports, } = req.body;

    const validatedCapacity = parseInt(capacity);
    const validatedLength = parseFloat(length);
    const validatedWidth = parseFloat(width);

    if (!futsalName || !idNumber || !address || !dayRate || !nightRate || !capacity || !length || !width || !specification || !agreeTerms || !sports) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const sportsArray = Array.isArray(sports)
      ? sports
      : typeof sports === "string"
        ? sports.split(',').map(s => s.trim().toLowerCase())
        : [];

    const allowedSports = ['cricket', 'football', 'tennis'];
    const invalidSports = sportsArray.filter(s => !allowedSports.includes(s));

    if (invalidSports.length > 0) {
      return res.status(400).json({ message: `Invalid sport(s): ${invalidSports.join(', ')}` });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const newImage = new Image({ url: file.path, filename: file.filename });
          await newImage.save();
          return newImage._id;
        })
      );
    } else {
      return res.status(400).json({ message: "Please upload at least one image." });
    }

    // Get the logged-in admin's ID (from the token or session)
    const adminId = req.user.adminId;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Add the new court to the admin's courts array
    const newCourt = {
      futsalName,
      idNumber,
      address,
      dayRate,
      nightRate,
      capacity: validatedCapacity,
      length: validatedLength,
      width: validatedWidth,
      specification,
      fileName: imageUrls,
      agreeTerms,
      isVerified: false,
      sports: sportsArray,
      verificationToken, // Store the token for verification
    };

    admin.courts.push(newCourt);
    await admin.save();

    // Send verification email to Super Admin
    const verificationLink = `${process.env.CLIENT_URL}/admin/verify-court?token=${verificationToken}`;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
        <h2 style="color: #333;">New Court Registration</h2>
        <p style="font-size: 16px; color: #555;">
          A new futsal court (${futsalName}) has been added by ${admin.name}. Please review and verify the court registration by clicking the button below:
        </p>
        <div style="margin: 20px 0;">
          <a href="${verificationLink}" 
             style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
             Verify Court
          </a>
        </div>
        <p style="color: #777;">If you did not request this, you can ignore this email.</p>
      </div>
    `;

    await sendEmail(process.env.SUPER_ADMIN_EMAIL, "Verify New Court", emailContent);

    res.status(201).json({ message: "Court added successfully. Pending Super Admin verification.", courts: admin.courts });
  } catch (error) {
    console.error("Error adding court:", error);
    res.status(500).json({ message: "Server error", error: error.stack });
  }
};



exports.getCourtsByAdminId = async (req, res) => {
  try {
    const adminId = req.user.adminId;  // Assuming adminId is in the token payload
    const admin = await Admin.findById(adminId).select("courts");  // Select only the courts field

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Return the courts associated with this admin
    res.status(200).json({ courts: admin.courts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().populate({
      path: "courts.fileName", // Populate fileName inside courts
      model: "Image", // Ensure it references the Image model
    });

    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET request to fetch a single admin by ID
exports.getAdminById = async (req, res) => {
  const adminId = req.params.id;

  try {
    const admin = await Admin.findById(adminId).populate({
      path: "courts.fileName", // Populate fileName inside courts
      model: "Image",
    });

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
  try {
    // Extract the token from headers
    const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer TOKEN"
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.adminId; // Assuming `adminId` is stored in the token payload

    if (!adminId) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    const { name, email } = req.body;

    // Find the admin by ID
    let admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if the email is being updated and ensure uniqueness
    if (email && email !== admin.email) {
      const emailExists = await Admin.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    // Update only name and email
    admin.name = name || admin.name;
    admin.email = email || admin.email;

    await admin.save();

    res.status(200).json({
      message: "Admin updated successfully",
      admin: { name: admin.name, email: admin.email },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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


exports.updateCourtById = async (req, res) => {
  try {
    // Validate token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.adminId;

    if (!adminId) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    // Get court ID from URL params
    const { courtId } = req.params;
    const updateData = req.body;

    // Prevent updating `idNumber`
    if (updateData.idNumber) {
      return res.status(400).json({ message: "Updating 'idNumber' is not allowed" });
    }

    // ✅ Find the Admin who owns this court
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // ✅ Find the specific court in the admin's courts array
    const court = admin.courts.find((c) => c._id.toString() === courtId);
    if (!court) {
      return res.status(404).json({ message: "Court not found or unauthorized" });
    }

    // ✅ Handle updating images by image ID
    if (updateData.images && Array.isArray(updateData.images)) {
      for (const { imageId, newImage } of updateData.images) {
        const imageIndex = court.fileName.findIndex((img) => img._id.toString() === imageId);
        if (imageIndex !== -1) {
          court.fileName[imageIndex] = newImage;
        }
      }
    }

    // ✅ Update other court fields (excluding `idNumber` and `images`)
    Object.keys(updateData).forEach((key) => {
      if (key !== "idNumber" && key !== "images") {
        court[key] = updateData[key];
      }
    });

    await admin.save();

    res.status(200).json({ message: "Court updated successfully", updatedCourt: court });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};









