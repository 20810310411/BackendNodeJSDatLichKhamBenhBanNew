const express = require("express");
import userDoctor from '../controllers/User/user.doctor.controller';
const router = express.Router();

// route create doctor
router.post("/create-doctor", userDoctor.createDoctor );
// get all doctor
router.get("/fetch-all-doctor", userDoctor.fetchAllDoctor );
// get all Chuyên khoa
router.get("/fetch-all-chuyen-khoa", userDoctor.fetchAllChuyenKhoa );
// get all Chức vụ
router.get("/fetch-all-chuc-vu", userDoctor.fetchAllChucVu );
// get all phòng khám
router.get("/fetch-all-phong-kham", userDoctor.fetchAllPhongKham );

module.exports = router;