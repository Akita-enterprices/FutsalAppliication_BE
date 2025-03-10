const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who made the booking
  court: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // Reference to the futsal court (Admin model)
  date: { type: String, required: true }, // YYYY-MM-DD format
  timeSlot: { type: String, required: true }, // e.g., "18:00-19:00"
  status: { 
    type: String, 
    enum: ["pending","approved", "confirmed", "cancelled"], 
    default: "pending" 
  }, // Booking status
  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid"], 
    default: "pending" 
  }, // Payment status
  createdAt: { type: Date, default: Date.now } // Auto-generated timestamp
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
