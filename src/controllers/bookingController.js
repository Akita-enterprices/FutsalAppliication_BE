const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const User = require('../models/userModel');
const { Admin, Court } = require("../models/adminModel");
const sendEmail = require("../utils/email");

exports.createBooking = async (req, res) => {
  try {
    const { user, court, date,sports, timeSlot } = req.body;

    // Ensure required fields are provided
    if (!user || !court || !date || !sports || !timeSlot) {
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

    // Ensure the booking date is not in the past
    if (bookingDate < new Date()) {
      return res.status(400).json({ message: "Booking date cannot be in the past." });
    }

    // Check if court exists (directly by court ID)
    const selectedCourt = await Court.findById(court);
    if (!selectedCourt) {
      return res.status(404).json({ message: "Court not found." });
    }

    // Additional validation: Check if the requested time slot is already booked
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
      sports,
      timeSlot,
      status: "pending",
      paymentStatus: "pending",
    });

    // Save the booking
    await booking.save();
    const courtAdmin = await Admin.findOne({ courts: selectedCourt._id });

    if (courtAdmin) {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #333;">New Booking Alert!</h2>
          <p style="font-size: 16px; color: #555;">
            A new booking has been made for your futsal court <strong>${selectedCourt.futsalName}</strong>.
          </p>
          <ul>
            <li><strong>Date:</strong> ${booking.date}</li>
            <li><strong>Time Slot:</strong> ${booking.timeSlot}</li>
            <li><strong>Sport:</strong> ${booking.sports}</li>
          </ul>
          <p style="color: #777;">Please log in to your dashboard to manage this booking.</p>
        </div>
      `;
    
      await sendEmail(
        courtAdmin.email,
        "New Booking for Your Futsal Court",
        emailContent
      );
    }
    
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.getAllBookings = async (req, res) => {
  try {
    const adminId = req.user.adminId;
    console.log("admin id"+adminId);
    if (!adminId) {
      return res.status(401).json({ message: "Admin ID missing from request" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const courtIds = admin.courts.map(c => c._id);
    console.log("Court IDs for admin:", courtIds);

    const bookings = await Booking.find({ court: { $in: courtIds } })
      .populate("user", "name email")
      .populate("court");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error getting bookings:", error);
    res.status(500).json({ message: "Server error" });
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
exports.updateStatusBooking = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const bookingId = req.params.id;
    const adminId = req.user.adminId;
    console.log("admin id"+adminId);
    if (!adminId) {
      return res.status(401).json({ message: "Admin ID missing from request" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 1. Find the booking
    const booking = await Booking.findById(bookingId).populate("court");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const ownsCourt = admin.courts.includes(booking.court._id);
    console.log("court "+ownsCourt);

    if (!ownsCourt) {
      return res.status(403).json({ message: "You do not have permission to update this booking." });
    }

    // 3. Update status
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();
// Populate user to get their email
const user = await User.findById(booking.user);
if (user) {
  const subject = "Booking Status Update";
  const message = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">Booking Status Updated</h2>
    <p>Hi ${user.name},</p>
    <p>We're writing to inform you that your booking has been <strong>updated</strong>.</p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; font-weight: bold;">Futsal Court</td>
        <td style="padding: 8px;">${booking.court.futsalName}</td>
      </tr>
      <tr style="background-color: #f9f9f9;">
        <td style="padding: 8px; font-weight: bold;">Date</td>
        <td style="padding: 8px;">${new Date(booking.date).toDateString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;">Time Slot</td>
        <td style="padding: 8px;">${booking.timeSlot}</td>
      </tr>
      <tr style="background-color: #f9f9f9;">
        <td style="padding: 8px; font-weight: bold;">Booking Status</td>
        <td style="padding: 8px;">${booking.status}</td>
      </tr>
    </table>
    <p>If you have any questions, feel free to reply to this email.</p>
    <p>Thank you for using our service!</p>
    <hr />
    <p style="font-size: 0.9em; color: #777;">This is an automated message. Please do not reply directly.</p>
  </div>
`;

  await sendEmail(user.email, subject, message);
}

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.userUpdateBooking = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const bookingId = req.params.id;
    const userId = req.user.userId;
    console.log("userid"+userId);

    const booking = await Booking.findById(bookingId).populate("court");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure the booking belongs to the user
    if (booking.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this booking" });
    }

    // Only allow update if current status is "pending" or "approved"
    if (!["pending", "approved"].includes(booking.status)) {
      return res.status(400).json({ message: `Booking can only be updated if it's pending or approved. Current status: ${booking.status}` });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    await booking.save();

    // Fetch user and admin to send emails
    const user = await User.findById(userId);
    const courtAdmin = await Admin.findById(booking.court.admin); // Assuming court has an `admin` field

    // Construct HTML email message
    const message = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Booking Status Updated</h2>
        <p>Booking for <strong>${booking.court.futsalName}</strong> on ${new Date(booking.date).toDateString()} at ${booking.timeSlot} has been updated.</p>
        <p><strong>New Status:</strong> ${booking.status}</p>
      </div>
    `;

    // Send to user
    await sendEmail(user.email, "Your Booking Update", message);

    // Send to admin
    if (courtAdmin && courtAdmin.email) {
      await sendEmail(courtAdmin.email, "A Booking Has Been Updated", message);
    }

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("User update booking error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const admin = await Admin.findById(req.user.id);
    console.log("admin"+admin);
    if (!admin) {
      return res.status(403).json({ message: "Admin not found" });
    }

    // Check if the booking's court belongs to this admin
    const courtId = booking.court.toString();
    const ownsCourt = admin.courts.some(court => court.toString() === courtId);

    if (!ownsCourt) {
      return res.status(403).json({ message: "Unauthorized to delete this booking" });
    }

    await booking.deleteOne();
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









