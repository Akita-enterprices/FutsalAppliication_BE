const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const superAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please provide a valid email address"],
    },
    nicOrPassport: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password should be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["superadmin"],
      default: "superadmin",
    },
  },
  { timestamps: true }
);

superAdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  // Method to compare password
  superAdminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

const SuperAdmin = mongoose.model("superAdmin", superAdminSchema);
// module.exports = superAdmin;



const pendingDeletionSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  email: { type: String, required: true }, 
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now } 
});
const PendingDeletion = mongoose.model("pendingDeletion", pendingDeletionSchema);

module.exports = {SuperAdmin,PendingDeletion}
// module.exports = mongoose.model("PendingDeletion", pendingDeletionSchema);

