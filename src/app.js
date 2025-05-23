const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const config = require("./config/config");
const errorHandler = require("./utils/errorHandler");
const cors = require("cors");
const availableRoutes = require("./routes/availableRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swaggerDocs").swaggerDocs;
dotenv.config();
const app = express();

app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://futsal-application-0fjv.onrender.com",
  ], // Add your frontend URLs here
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(config.dbUri)  // Removed deprecated options
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// app.use(express.json());

// Use Swagger UI for API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/available-times", availableRoutes);
app.use("/api/superAdmin",superAdminRoutes);
app.use(errorHandler);

module.exports = app;
