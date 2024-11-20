const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const availableTimeSchema = new Schema({
  courtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [
    {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      isBooked: {
        type: Boolean,
        default: false,
      },
      bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
  ],
});

const AvailableTime = mongoose.model("AvailableTime", availableTimeSchema);

module.exports = AvailableTime;
