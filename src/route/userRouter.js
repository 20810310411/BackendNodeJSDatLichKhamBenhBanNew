const express = require("express");
import loginAdmin from '../controllers/Login/login.admin.controller';
const router = express.Router();

// route đăng nhập admin
router.post("/login-admin", loginAdmin.loginAccAdmin );
// route register admin
router.post("/register-admin", loginAdmin.registerAccAdmin );
// route logout  admin
router.post("/logout-admin", loginAdmin.logoutAdmin );


module.exports = router;