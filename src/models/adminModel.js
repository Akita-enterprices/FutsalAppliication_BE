const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  idNumber: {
    type: String,
    required: true,
  },
  futsalName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dayRate: {
    type: Number,
    required: true,
  },
  nightRate: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  specification: {
    type: String,
    required: true,
  },
  // fileName: {
  //   type: String,
  //   required: true,
  // },
  agreeTerms: {
    type: Boolean,
    required: true,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
