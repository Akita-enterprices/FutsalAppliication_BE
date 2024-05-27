const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto= require("crypto");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  reserPasswordToken:String,
  resetPasswordExpire:Date,
});

// Hash password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken=function(){
   const resetToken = crypto.randomBytes(32).toString("hex");

   this.reserPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
   this.resetPasswordExpire=Date.now() + 10 * 60 * 1000;

   return resetToken
};

module.exports = mongoose.model("User", userSchema);
