const express = require("express");
import userDoctor from '../controllers/User/user.doctor.controller';
const router = express.Router();

// get all doctor
router.get("/fetch-all-doctor", userDoctor.fetchAllDoctor );
// route create doctor
router.post("/create-doctor", userDoctor.createDoctor );
// route update doctor
router.put("/update-doctor", userDoctor.updateDoctor );
// route delete doctor
router.delete("/delete-doctor/:id", userDoctor.deleteDoctor );


// get all Chuyên khoa
router.get("/fetch-all-chuyen-khoa", userDoctor.fetchAllChuyenKhoa );
// route create Chuyên khoa
router.post("/create-chuyen-khoa", userDoctor.createChuyenKhoa );
// route delete Chuyên khoa
router.delete("/delete-chuyen-khoa/:id", userDoctor.deleteChuyenKhoa );

// get all Chức vụ
router.get("/fetch-all-chuc-vu", userDoctor.fetchAllChucVu );
// route create Chức vụ
router.post("/create-chuc-vu", userDoctor.createChucVu );
// route update Chức vụ
router.put("/update-chuc-vu", userDoctor.updateChucVu );
// route delete Chức vụ
router.delete("/delete-chuc-vu/:id", userDoctor.deleteChucVu );


// get all phòng khám
router.get("/fetch-all-phong-kham", userDoctor.fetchAllPhongKham );
// route create phòng khám
router.post("/create-phong-kham", userDoctor.createPhongKham );
// route delete phòng khám
router.delete("/delete-phong-kham/:id", userDoctor.deletePhongKham );
// route update Chức vụ
router.put("/update-phong-kham", userDoctor.updatePhongKham );

module.exports = router;