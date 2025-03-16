const express = require("express");
const {
  signup,
  userLogin,
  me,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// Authentication Routes
router.post("/signup", signup);
router.post("/userLogin", userLogin);
router.get("/me", verifyToken, me);

// User Management Routes
router.get("/getAllUsers", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/updateUser",updateUser);
router.delete("/users/:id",deleteUser);

module.exports = router;
