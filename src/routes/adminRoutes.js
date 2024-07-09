const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminController");

router.post("/register", registerAdmin);
router.get("/", getAllAdmins); // Get all admins
router.get("/:id", getAdminById); // Get admin by ID
router.put("/:id", updateAdmin); // Update admin by ID
router.delete("/:id", deleteAdmin); // Delete admin by ID

module.exports = router;