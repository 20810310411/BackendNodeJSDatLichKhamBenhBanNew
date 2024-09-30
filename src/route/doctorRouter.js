const express = require("express");
import userDoctor from '../controllers/User/user.doctor.controller';
const router = express.Router();

// route create doctor
router.post("/create-doctor", userDoctor.createDoctor );
// get all doctor
router.get("/fetch-all-doctor", userDoctor.fetchAllDoctor );
// get all ChuyenKhoa
router.get("/fetch-all-chuyen-khoa", userDoctor.fetchAllChuyenKhoa );

module.exports = router;