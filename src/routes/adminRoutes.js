const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const checkJwt = require('../middleware/checkJwt');
const verifyToken = require('../middleware/verifyToken');
const {
  registerAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  adminLogin,
  addCourt,
  getCourtsByAdminId,
} = require("../controllers/adminController");

router.post("/register", upload,registerAdmin);
console.log("Request received");

router.post("/addCourt",upload,verifyToken,addCourt);
router.get("/getCourts",verifyToken,getCourtsByAdminId);
router.get("/", getAllAdmins);
router.post("/login", adminLogin);
router.get("/:id", getAdminById);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

router.get("/protected", checkJwt, (req, res) => {
  res.status(200).json({
    message: "Admin authenticated successfully!",
    user: req.user, // req.user contains the decoded JWT payload
  });
});


module.exports = router;
