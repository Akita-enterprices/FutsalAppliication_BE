const express = require("express");
const router = express.Router();
const superAdminController = require("../controllers/superAdminController");
const verifySuperAdmin = require("../middleware/verifySuperAdmin");

router.post("/register", superAdminController.registerSuperAdmin);
router.post("/login", superAdminController.superAdminLogin);
router.put("/verifyAdmin",verifySuperAdmin, superAdminController.verifyCourt);

module.exports = router;
