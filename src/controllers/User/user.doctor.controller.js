const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AccAdmin = require('../../model/AccAdmin'); // Đường dẫn đến model của bạn
const ChuyenKhoa = require('../../model/ChuyenKhoa'); // Đường dẫn đến model của bạn
const ChucVu = require('../../model/ChucVu'); // Đường dẫn đến model của bạn
const Role = require('../../model/Role'); // Đường dẫn đến model của bạn
const Doctor = require('../../model/Doctor');
const ThoiGianThu = require('../../model/ThoiGianThu');
const PhongKham = require('../../model/PhongKham');
require('dotenv').config();
// Secret key cho JWT
const JWT_SECRET = process.env.JWT_SECRET; 

module.exports = {
    fetchAllDoctor: async (req, res) => {
        try {
            const { page, limit } = req.query; // Lấy trang và kích thước trang từ query

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
                message: "Có lỗi xảy ra khi tìm Chuyên khoa của bác sĩ.",
                error: error.message,
            });
        }
    },

    fetchAllChucVu: async (req, res) => {
        try {
            let fetchAll = await ChucVu.find({})
            
            if(fetchAll) {
                return res.status(200).json({
                    data: fetchAll,
                    message: "đã tìm ra tất cả ChucVu"
                })
            } else {
                return res.status(404).json({                
                    message: "tìm ra tất cả ChucVu thất bại"
                })
            }

        } catch(error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi tìm chức vụ của bác sĩ.",
                error: error.message,
            });
        }
    },

    fetchAllPhongKham: async (req, res) => {
        try {
            let fetchAll = await PhongKham.find({})
            
            if(fetchAll) {
                return res.status(200).json({
                    data: fetchAll,
                    message: "đã tìm ra tất cả PhongKham"
                })
            } else {
                return res.status(404).json({                
                    message: "tìm ra tất cả PhongKham thất bại"
                })
            }

        } catch(error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi tìm phòng khám của bác sĩ.",
                error: error.message,
            });
        }
    },

    createDoctor: async (req, res) => {
        try {
            let {email, password, firstName, lastName, address, phoneNumber, 
                chucVuId, gender, image, chuyenKhoaId, phongKhamId, roleId, mota, thoiGianKhamId} = req.body

                console.log("chucVuId: ",chucVuId);
                console.log("chuyenKhoaId: ",chuyenKhoaId);
                
            
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
                email, 
                password: hashedPassword, 
                firstName, lastName, address, phoneNumber, 
                chucVuId: chucVuId || [], 
                gender, image, 
                chuyenKhoaId: chuyenKhoaId || [], 
                phongKhamId, roleId, mota, 
                thoiGianKhamId
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
    },

    updateDoctor: async (req, res) => {
        try {
            let {_id, email, password, firstName, lastName, address, phoneNumber, 
                chucVuId, gender, image, chuyenKhoaId, phongKhamId, roleId, mota, thoiGianKhamId} = req.body

                console.log("id: ",_id);                     

            // Hash the password
            // const hashedPassword = await bcrypt.hash(password, 10);

            let createDoctor = await Doctor.updateOne({_id: _id},{
                email, 
                // password: hashedPassword, 
                firstName, lastName, address, phoneNumber, 
                chucVuId: chucVuId || [], 
                gender, image, 
                chuyenKhoaId: chuyenKhoaId || [], 
                phongKhamId, roleId, mota, 
                thoiGianKhamId
            })
            
            if(createDoctor) {
                console.log("Chỉnh sửa thành công tài khoản");
                return res.status(200).json({
                    data: createDoctor,
                    message: "Chỉnh sửa tài khoản bác sĩ thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Chỉnh sửa tài khoản bác sĩ thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi Chỉnh sửa tài khoản bác sĩ.",
                error: error.message,
            });
        }
    },

    deleteDoctor: async (req, res) => {
        const _id = req.params.id

        let xoaAD = await Doctor.deleteOne({_id: _id})

        if(xoaAD) {
            return res.status(200).json({
                data: xoaAD,
                message: "Bạn đã xoá tài khoản bác sĩ thành công!"
            })
        } else {
            return res.status(500).json({
                message: "Bạn đã xoá tài khoản bác sĩ thất bại!"
            })
        }
    }
}