const Booking = require("../models/bookingModel");
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Admin = require('../models/adminModel'); 

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { user, court, date, timeSlot } = req.body;

    // Ensure required fields are provided
    if (!user || !court || !date || !timeSlot) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate user and court
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(court)) {
      return res.status(400).json({ message: "Invalid court ID" });
    }

    // Check if user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if court exists
    const courtExists = await Admin.findById(court);
    if (!courtExists) {
      return res.status(404).json({ message: "Court not found" });
    }

    // Create the booking
    const booking = new Booking({
      user,
      court,
      date,
      timeSlot,
      status: 'pending',  // Default status is pending
      paymentStatus: 'pending',  // Default payment status is pending
    });

    // Save the booking
    await booking.save();

    // Return the response
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error);  // Log the error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user court");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user court");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();
    
    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getBookingsForAdmin = async (req, res) => {
  try {
    console.log(req.user);  // Check if `adminId` exists here

    // Ensure adminId is an ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.user.adminId)) {
      return res.status(400).json({ message: "Invalid admin ID format" });
    }

    const adminId = new mongoose.Types.ObjectId(req.user.adminId);
    console.log(adminId); // Log the adminId

    // Find bookings where the court (admin) matches the logged-in admin's id
    const bookings = await Booking.find({ court: adminId })
      .populate("user", "username email")  // Populate user details
      .populate("court", "futsalName address"); // Populate court details

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this admin." });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    res.status(500).json({ message: "Server error", error: error.stack });
  }
};
