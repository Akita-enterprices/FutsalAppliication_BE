const express = require("express");
const bookingController = require("../controllers/bookingController");
const router = express.Router();
// const checkJwt = require("../middleware/checkJwt")
const verifyToken = require("../middleware/verifyToken");

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);
router.get("/admin/bookings", verifyToken, bookingController.getBookingsForAdmin);



module.exports = router;
