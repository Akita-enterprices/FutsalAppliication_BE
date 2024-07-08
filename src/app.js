const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const config = require("./config/config");
const errorHandler = require("./utils/errorHandler");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// const corsOptions = {
//   origin: "http://localhost:3000", // Your frontend's URL
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

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
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
