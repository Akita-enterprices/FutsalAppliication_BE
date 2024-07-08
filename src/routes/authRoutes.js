const express = require("express");
const { signup, login, me } = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, me);

module.exports = router;
