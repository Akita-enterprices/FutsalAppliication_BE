// const express = require("express");
// const { signup, login, me } = require("../controllers/authController");
// const verifyToken = require("../middleware/auth");

// const router = express.Router();

// router.post("/signup", signup);
// router.post("/login", login);
// router.get("/me", verifyToken, me);

// module.exports = router;

const express = require("express");
const {
  signup,
  login,
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
router.post("/login", login);
router.get("/me", verifyToken, me);

// User Management Routes
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id",updateUser);
router.delete("/users/:id",deleteUser);

module.exports = router;
