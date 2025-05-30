const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const checkJwt = require('../middleware/checkJwt');
const verifyToken = require('../middleware/verifyToken');
const {
  registerAdmin,
  getAdminById,
  updateAdmin,
  requestAdminDeletion,
  adminLogin,
  addCourt,
  getCourtsByAdminId,
  changeAdminPassword,
  updateCourtById,
  deleteCourtByAdmin
} = require("../controllers/adminController");

router.post("/register", upload,registerAdmin);
console.log("Request received");

router.post("/addCourt",upload,verifyToken,addCourt);
router.get("/getCourtsByAdminId",verifyToken,getCourtsByAdminId);
router.post("/login", adminLogin);
router.get("/:id", getAdminById);
router.put("/update", updateAdmin);
router.delete("/deleteAdmin",verifyToken,requestAdminDeletion);
router.put("/changePassword", changeAdminPassword);
router.put("/updateCourt/:courtId", updateCourtById);
router.delete("/deleteCourt/:courtId", verifyToken,deleteCourtByAdmin);


router.get("/protected", checkJwt, (req, res) => {
  res.status(200).json({
    message: "Admin authenticated successfully!",
    user: req.user, // req.user contains the decoded JWT payload
  });
});


module.exports = router;
