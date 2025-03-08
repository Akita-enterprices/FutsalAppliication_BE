const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  idNumber: {
    type: String,
    required: true,
  },
  futsalName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that each admin has a unique email
    match: [/.+\@.+\..+/, "Please provide a valid email address"], // Email format validation
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password should be at least 8 characters long"], // Password validation
  },
  dayRate: {
    type: Number,
    required: true,
  },
  nightRate: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  specification: {
    type: String,
    required: true,
  },
  fileName: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  }
],
  agreeTerms: {
    type: Boolean,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false, 
  },
});

const bcrypt = require('bcryptjs');

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const Admin = mongoose.model("Admin", adminSchema);


module.exports = Admin;
