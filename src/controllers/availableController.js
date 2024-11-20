const AvailableTime = require("../models/availableModel");

// Create a new available time slot
exports.createAvailableTime = async (req, res) => {
  try {
    const { courtId, date, startTime, endTime } = req.body;

    // Create a time slot
    const timeSlot = {
      startTime,
      endTime,
      isBooked: false,
      bookedBy: null,
    };

    // Create available time for the given date
    const availableTime = new AvailableTime({
      courtId,
      date,
      timeSlots: [timeSlot],
    });

    await availableTime.save();
    res.status(201).json(availableTime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all available time slots
exports.getAvailableTimes = async (req, res) => {
  try {
    const availableTimes = await AvailableTime.find()
      .populate("courtId")
      .populate("timeSlots.bookedBy");
    res.status(200).json(availableTimes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get available time slots by court ID
exports.getAvailableTimesByCourt = async (req, res) => {
  try {
    const { courtId } = req.params;
    const availableTimes = await AvailableTime.find({ courtId })
      .populate("courtId")
      .populate("timeSlots.bookedBy");
    res.status(200).json(availableTimes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Book a time slot
exports.bookTimeSlot = async (req, res) => {
  try {
    const { courtId, date, startTime, customerName, mobileNumber } = req.body;

    // Find the available time slot
    const availableTime = await AvailableTime.findOne({ courtId, date });
    if (!availableTime) {
      return res.status(404).json({ message: "Available time slot not found" });
    }

    // Find the specific time slot
    const timeSlot = availableTime.timeSlots.find(
      (slot) => slot.startTime === startTime
    );
    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    // Check if the time slot is already booked
    if (timeSlot.isBooked) {
      return res.status400().json({ message: "Time slot is already booked" });
    }

    // Update the time slot to mark it as booked
    timeSlot.isBooked = true;
    timeSlot.bookedBy = { customerName, mobileNumber };

    await availableTime.save();
    res.status(200).json({ message: "Time slot booked successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
