const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const config = require("../config/config");
const crypto = require("crypto");
const nodemailer= require("nodemailer");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
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

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword=async(req,res) => {
const {email} = req.body;

try{
  const user= await User.findOne({email});

  if(!user){
    return res.status(404).json({message:"User not found"});
  }
const resetToken =  user.createPasswordResetToken();
await user.save({validateBeforeSave:false});

const resetUrl=`${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
const message = `You requested a password reset. Please make a PUT request to: ${resetUrl}`;

const transporter = nodemailer.createTransport({
  service:"Gmail",
  auth:{
    user:process.env.EMAIL,
    user:process.env.EMAIL_PASSWORD,
  }
});
await transporter.sendMail({
  to: user.email,
  subject: "Password Reset",
  text: message,
});
res.status(200).json({ message: "Email sent" });
} catch (error) {
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(500).json({ message: "Server error" });
}



};