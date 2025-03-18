const express = require("express");
const {
  signup,
  userLogin,
  me,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  verifyEmail
} = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/userLogin", userLogin);
router.get("/me", verifyToken, me);
router.get("/getAllUsers", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/updateUser",updateUser);
router.delete("/users/:id",deleteUser);
router.get("/verify-email", verifyEmail);

module.exports = router;
