const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const config = require("./config/config");
const errorHandler = require("./utils/errorHandler");

dotenv.config();
const app = express();

app.use(express.json());

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

app.use("/api/auth", authRoutes);

app.use(errorHandler);

module.exports = app;
