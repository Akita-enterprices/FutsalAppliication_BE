const express = require("express");
const router = express.Router();
const superAdminController = require("../controllers/superAdminController");
const verifySuperAdmin = require("../middleware/verifySuperAdmin");

router.post("/register", superAdminController.registerSuperAdmin);
router.post("/login", superAdminController.superAdminLogin);
router.put("/verifyAdmin", superAdminController.verifyCourt);
router.put("/confirmDelete", superAdminController.confirmAdminDeletion);
router.get("/",superAdminController.getAllAdmins);

module.exports = router;
