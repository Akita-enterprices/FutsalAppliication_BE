// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// const config = require("../config/config");
// const bcrypt = require("bcrypt");

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
// };

// exports.signup = async (req, res) => {
//   const { username, email, password, phone,auth0UserId} = req.body;

//   try {
//     // Check if user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const newUser = new User({
//       username,
//       email,
//       password,
//       phone,
//       auth0UserId
//     });

//     const user = await newUser.save();

//     // Check if user is created successfully
//     if (user) {
//       return res.status(201).json({
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         phone: user.phone,
//         token: generateToken(user._id),
//       });
//     } else {
//       return res.status(400).json({ message: "Failed to create user" });
//     }
//   } catch (error) {
//     console.error("Signup Error:", error);
//     return res.status(500).json({ message: "Server error during signup" });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // const isMatch = await bcrypt.compare(password, user.password);
//     // if (!isMatch) {
//     //   return res.status(400).json({ message: "Invalid credentials" });
//     // }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: 86400,
//     });
//     res.status(200).send({ token });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.me = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");

//     // Check if user exists
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error("Get User Info Error:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error while fetching user info" });
//   }
// };


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const config = require("../config/config");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Signup
exports.signup = async (req, res) => {
  const { username, email, password, phone, auth0UserId, nicOrPassport } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email, password, phone, auth0UserId, nicOrPassport });
    const user = await newUser.save();

    if (user) {
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      });
    } else {
      return res.status(400).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error during signup" });
  }
};


// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get User Profile
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Get User Info Error:", error);
    return res.status(500).json({ message: "Server error while fetching user info" });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// Get User By ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ message: "Server error while fetching user" });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error while updating user" });
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
