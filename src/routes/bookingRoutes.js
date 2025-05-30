const express = require("express");
const bookingController = require("../controllers/bookingController");
const router = express.Router();
// const checkJwt = require("../middleware/checkJwt")
const verifyToken = require("../middleware/verifyToken");

router.post("/", bookingController.createBooking);
router.get("/", verifyToken,bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.put("/:id", verifyToken,bookingController.updateStatusBooking);
router.put("/userUpdateStatus/:id", verifyToken,bookingController.userUpdateBooking);
router.delete("/delete/:id", verifyToken,bookingController.deleteBooking);
router.get("/admin/bookings", verifyToken, bookingController.getBookingsForAdmin);



module.exports = router;
