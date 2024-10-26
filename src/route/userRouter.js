const express = require("express");
import loginAdmin from '../controllers/Login/login.admin.controller';
import loginBenhNhan from '../controllers/Login/login.user.controller';
const router = express.Router();

// route đăng nhập admin
router.post("/login-admin", loginAdmin.loginAccAdmin );
// route register admin
router.post("/register-admin", loginAdmin.registerAccAdmin );
// route logout  admin
router.post("/logout-admin", loginAdmin.logoutAdmin );

// route đăng nhập benh nhan
router.post("/login-benh-nhan", loginBenhNhan.loginBenhNhan );
// route register benh nhan
router.post("/register-benh-nhan", loginBenhNhan.registerBenhNhan);
// route logout  benh nhan
router.post("/logout-benh-nhan", loginBenhNhan.logoutBenhNhan );


module.exports = router;