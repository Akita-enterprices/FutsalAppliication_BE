const express = require("express");
const router = express.Router();
const availableController = require("../controllers/availableController");

// Create a new available time slot
router.post("/", availableController.createAvailableTime);

// Get all available time slots
router.get("/", availableController.getAvailableTimes);

// Get available time slots by court ID
router.get("/court/:courtId", availableController.getAvailableTimesByCourt);
router.post("/book", availableController.bookTimeSlot);

// // Update an available time slot
// router.put("/:id", availableController.updateAvailableTime);

// // Delete an available time slot
// router.delete("/:id", availableController.deleteAvailableTime);

module.exports = router;
