const Booking = require("../models/bookingModel");

// Create a new booking
exports.createBooking = async (req, res) => {
  const booking = new Booking(req.body);
  try {
    await booking.save();
    res.status(201).send(booking);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send();
    }
    res.status(200).send(booking);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking) {
      return res.status(404).send();
    }
    res.status(200).send(booking);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).send();
    }
    res.status(200).send(booking);
  } catch (error) {
    res.status(500).send(error);
  }
};
