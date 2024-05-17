const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const errorHandler = require("./utils/errorHandler");

const app = express();

// Connect to MongoDB
mongoose
  .connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.use(express.json());

app.use(errorHandler);

module.exports = app;
