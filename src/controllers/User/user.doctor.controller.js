const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AccAdmin = require('../../model/AccAdmin'); // Đường dẫn đến model của bạn
const ChuyenKhoa = require('../../model/ChuyenKhoa'); // Đường dẫn đến model của bạn
const ChucVu = require('../../model/ChucVu'); // Đường dẫn đến model của bạn
const Role = require('../../model/Role'); // Đường dẫn đến model của bạn
const Doctor = require('../../model/Doctor');
const ThoiGianThu = require('../../model/ThoiGianThu');
require('dotenv').config();
// Secret key cho JWT
const JWT_SECRET = process.env.JWT_SECRET; 

module.exports = {
    fetchAllDoctor: async (req, res) => {
        try {
            const { page = 1, limit = 5 } = req.query; // Lấy trang và kích thước trang từ query

             // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            // Tính toán số bản ghi bỏ qua
            const skip = (pageNumber - 1) * limitNumber;

            // Tìm tất cả bác sĩ với phân trang
            const fetchAll = await Doctor.find({})
                .populate("chucVuId chuyenKhoaId phongKhamId roleId thoiGianKhamId")
                .skip(skip)
                .limit(limitNumber);

            const totalDoctors = await Doctor.countDocuments(); // Đếm tổng số bác sĩ

            const totalPages = Math.ceil(totalDoctors / limitNumber); // Tính số trang

            return res.status(200).json({
                data: fetchAll,
                totalDoctors,
                totalPages,
                currentPage: pageNumber,
                message: "Đã tìm ra tất cả bác sĩ",
            });

            // let fetchAll = await Doctor.find({}).populate("chucVuId chuyenKhoaId phongKhamId roleId thoiGianKhamId")
            
            // if(fetchAll) {
            //     return res.status(200).json({
            //         data: fetchAll,
            //         message: "đã tìm ra tất cả doctor"
            //     })
            // } else {
            //     return res.status(404).json({                
            //         message: "tìm ra tất cả doctor thất bại"
            //     })
            // }

        } catch(error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi tìm tài khoản bác sĩ.",
                error: error.message,
            });
        }
    },

    fetchAllChuyenKhoa: async (req, res) => {
        try {
            let fetchAll = await ChuyenKhoa.find({})
            
            if(fetchAll) {
                return res.status(200).json({
                    data: fetchAll,
                    message: "đã tìm ra tất cả ChuyenKhoa"
                })
            } else {
                return res.status(404).json({                
                    message: "tìm ra tất cả ChuyenKhoa thất bại"
                })
            }

        } catch(error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi tìm tài khoản bác sĩ.",
                error: error.message,
            });
        }
    },

    createDoctor: async (req, res) => {
        try {
            let {email, password, firstName, lastName, address, phoneNumber, 
                chucVuId, gender, image, chuyenKhoaId, phongKhamId, roleId, mota, thoiGianKhamId} = req.body
            
            if (!email || !password || !firstName || !lastName) {
                return res.status(400).json({
                    message: "Vui lòng cung cấp đầy đủ thông tin (email, password, firstName, lastName)"
                });
            }

            const existingDoctor = await Doctor.findOne({ email });
            if (existingDoctor) {
                return res.status(409).json({
                    message: "Email đã tồn tại. Vui lòng sử dụng email khác."
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            let createDoctor = await Doctor.create({
                email, password: hashedPassword, firstName, lastName, address, phoneNumber, 
                chucVuId, gender, image, chuyenKhoaId, phongKhamId, roleId, mota, thoiGianKhamId
            })
            
            if(createDoctor) {
                console.log("thêm thành công tài khoản");
                return res.status(200).json({
                    data: createDoctor,
                    message: "Thêm tài khoản bác sĩ thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Thêm tài khoản bác sĩ thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi thêm tài khoản bác sĩ.",
                error: error.message,
            });
        }
    }
}