const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const config = require("../config/config");
const sendEmail = require("../utils/email"); 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const User = require("../models/userModel");
// const sendEmail = require("../utils/email"); 

exports.signup = async (req, res) => {
  const { name, email, password, phone, nicOrPassport, address } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      phone,
      nicOrPassport,
      address,
      isVerified: false,
    });

    const user = await newUser.save();

    // Generate email verification token
    const verificationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create verification link
    const verificationLink = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${verificationToken}`;

    // Email content
    const emailContent = `
      <h2>Welcome to Our Futsal Booking Platform, ${user.name}!</h2>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
      <p>
        <a href="${verificationLink}" style="background: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
      </p>
      <p>This link will expire in 1 hour.</p>
    `;

    // Send email
    try {
      await sendEmail(user.email, "Email Verification", emailContent);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      nicOrPassport: user.nicOrPassport,
      phone: user.phone,
      address: user.address,
      message: "Registration successful! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error during signup" });
  }
};


exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Invalid or missing token" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by email
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update the user's isVerified field to true
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Email Verification Error:", error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Login
exports.userLogin = async (req, res) => {
  console.log("Request Body:", req.body);

  const { username, password } = req.body;
  console.log("Username:", username);
  console.log("Password:", password);

  try {
    // Find the user by email OR NIC/Passport
    const user = await User.findOne({ $or: [{ email: username }, { nicOrPassport: username }] });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Incorrect password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Password matched!");

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "User authenticated successfully",
      token,
      user: { name: user.name, email: user.email, phone: user.phone, address: user.address },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
// // Get User Profile
exports.me = async (req, res) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer TOKEN"
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Extract userId from token payload

    // Fetch user data from DB, excluding password
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user details
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      nicOrPassport: user.nicOrPassport,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

  } catch (error) {
    console.error("Get User Info Error:", error);
    return res.status(500).json({ message: "Server error while fetching user info" });
  }
};


// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password for security

    res.status(200).json(
      users.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        nicOrPassport: user.nicOrPassport,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))
    );
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// Get User By ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      nicOrPassport: user.nicOrPassport,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ message: "Server error while fetching user info" });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    // Extract the token from headers
    const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer TOKEN"
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Assuming `userId` is stored in the token payload

    if (!userId) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    const { name, email, phone, address } = req.body;

    // Find the user by ID
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the email is being updated and ensure uniqueness
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    // Check if the phone is being updated and ensure uniqueness
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone number is already in use" });
      }
    }

    // Prevent `nicOrPassport` updates
    if (req.body.nicOrPassport && req.body.nicOrPassport !== user.nicOrPassport) {
      return res.status(400).json({ message: "Updating NIC or Passport is not allowed" });
    }

    // Update allowed fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};
