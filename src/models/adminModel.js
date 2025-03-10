const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const courtSchema = new mongoose.Schema({
  futsalName: { type: String, required: true },
  idNumber: { type: String, required: true },
  address: { type: String, required: true },
  dayRate: { type: Number, required: true },
  nightRate: { type: Number, required: true },
  capacity: { type: Number, required: true },
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  specification: { type: String, required: true },
  fileName: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    }
  ],
  agreeTerms: { type: Boolean, required: true },
  isVerified: { type: Boolean, default: false }, // Used to mark court as verified
});

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password should be at least 8 characters long"],
  },
  courts: [courtSchema], // Keeping all court-related fields inside the courts array
  // isVerified: { type: Boolean, default: false }, // Used to verify the admin
});

// Method to add a new court to the admin's courts array
adminSchema.methods.addCourt = async function (courtDetails) {
  this.courts.push(courtDetails);
  await this.save();
};

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
