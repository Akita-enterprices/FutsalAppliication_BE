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

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  console.log("Hashing password before saving:", this.password);
  this.password = await bcrypt.hash(this.password, 10);
  next();
});



adminSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("Candidate password:", candidatePassword);
  console.log("Stored password hash:", this.password);

  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log("Passwords match:", isMatch);
  return isMatch;
};




const Admin = mongoose.model("Admin", adminSchema);


module.exports = Admin;
