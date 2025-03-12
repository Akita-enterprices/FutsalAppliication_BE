const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const User = require('../models/userModel');
const { Admin, Court } = require("../models/adminModel");

exports.createBooking = async (req, res) => {
  try {
    const { user, court, date, timeSlot } = req.body;

    // Ensure required fields are provided
    if (!user || !court || !date || !timeSlot) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate user and court IDs
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

    // Validate date format (Ensure it's a valid date)
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    // Check if court exists under the admin
    const adminWithCourt = await Admin.findOne({ "courts._id": court });
    if (!adminWithCourt) {
      return res.status(404).json({ message: "Court not found" });
    }

    const selectedCourt = adminWithCourt.courts.find(
      courtItem => courtItem._id.toString() === court
    );
    
    if (!selectedCourt) {
      return res.status(404).json({ message: "Court not found in the admin's courts." });
    }

  

    // Additional validation: Check if the requested time slot is already booked (optional)
    const existingBooking = await Booking.findOne({
      court: selectedCourt._id,
      date: bookingDate,
      timeSlot
    });

    if (existingBooking) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    // Now, create the booking with the correct court
    const booking = new Booking({
      user,
      court: selectedCourt._id,  // Ensure you're assigning the correct court _id
      date: bookingDate,
      timeSlot,
      status: "pending",
      paymentStatus: "pending",
    });

    // Save the booking
    await booking.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Get all bookings with optional pagination
exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;  // default to page 1 and limit 10
    const skip = (page - 1) * limit;

    const bookings = await Booking.find()
      .skip(skip)  // Pagination
      .limit(limit)  // Limit the number of results
      .populate("user", "username email phone")  // Populate user info
      .populate({
        path: "court",  // Populate court
        select: "futsalName address dayRate nightRate capacity",  // Select specific fields to return
        match: { _id: { $ne: null } },  // Ensure court is not null
      });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    // Log the populated bookings to debug
    console.log("Bookings:", bookings);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error:", error);  // Log error details for debugging
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
    // Log admin ID to debug
    console.log("Admin ID from request:", req.user.adminId);

    if (!req.user.adminId || !mongoose.Types.ObjectId.isValid(req.user.adminId)) {
      return res.status(400).json({ message: "Invalid admin ID format" });
    }

    const adminId = new mongoose.Types.ObjectId(req.user.adminId);

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const courtIds = admin.courts.map(court => court._id);
    if (courtIds.length === 0) {
      return res.status(404).json({ message: "No courts registered under this admin." });
    }

    console.log("Court IDs owned by admin:", courtIds);

    // Fetch bookings where court matches the admin's courts
    const bookings = await Booking.find({ court: { $in: courtIds } })
      .populate("user", "username email") // Populate user info
      .populate({
        path: "court",  // Populate court details
        select: "futsalName address capacity",  // Select specific fields to return
        match: { _id: { $ne: null } },  // Ensure court is not null
      });

    console.log("Bookings with populated court:", bookings);

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this admin." });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    res.status(500).json({ message: "Server error", error: error.stack });
  }
};









