const express = require("express");
const router = express.Router();
const courtController = require("../controllers/courtsController");

router.get("/", courtController.getAllCourts); // GET /api/courts
router.get("/:id", courtController.getCourtById);
module.exports = router;
