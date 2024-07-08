const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const config = require("../config/config");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.signup = async (req, res) => {
  const { username, email, password, phone } = req.body;
  console.log(password);

  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed password:", hashedPassword);
    const newUser = new User({
      username,
      email,
      password,
      phone,
    });
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await newUser.save();

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found.");
    // const isMatch = await bcrypt.compare(password, user.password);
    // console.log("Password match:", isMatch);
    // if (!isMatch) return res.status(400).send("Invalid credentials.");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    console.log("hello");
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
