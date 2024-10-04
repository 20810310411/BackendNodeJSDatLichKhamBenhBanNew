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
            const { page, limit, firstName, lastName, address } = req.query; // Lấy trang và kích thước trang từ query

             // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            // Tính toán số bản ghi bỏ qua
            const skip = (pageNumber - 1) * limitNumber;

            // Tạo query tìm kiếm
            const query = {};
            // if (firstName) {
            //     query.firstName = { $regex: firstName, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
            // }
            // if (lastName) {
            //     query.lastName = { $regex: lastName, $options: 'i' };
            // }
            // Tạo điều kiện tìm kiếm
            if (firstName || lastName || address) {
                const searchKeywords = (firstName || '') + ' ' + (lastName || '') + ' ' + (address || '');
                const keywordsArray = searchKeywords.trim().split(/\s+/);

                const searchConditions = keywordsArray.map(keyword => ({
                    $or: [
                        { firstName: { $regex: keyword, $options: 'i' } },
                        { lastName: { $regex: keyword, $options: 'i' } },
                        { address: { $regex: keyword, $options: 'i' } },
                    ]
                }));

                query.$or = searchConditions;
            }

            // Tìm tất cả bác sĩ với phân trang
            const fetchAll = await Doctor.find(query)
                .populate("chucVuId chuyenKhoaId phongKhamId roleId thoiGianKhamId")
                .skip(skip)
                .limit(limitNumber);

            const totalDoctors = await Doctor.countDocuments(query); // Đếm tổng số bác sĩ

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
            const { page, limit, name } = req.query; // Lấy trang và kích thước trang từ query            

            // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            // Tính toán số bản ghi bỏ qua
            const skip = (pageNumber - 1) * limitNumber;

            // Tạo query tìm kiếm
            const query = {};
            if (name) {
                // query.name = { $regex: name, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
                query.name = { $regex: `.*${name}.*`, $options: 'i' }; // Tìm kiếm gần đúng
            }

            // Tìm tất cả bác sĩ với phân trang
            const fetchAll = await ChucVu.find(query)                
                .skip(skip)
                .limit(limitNumber);

            const totalChucVu = await ChucVu.countDocuments(query); // Đếm tổng số chức vụ

            const totalPages = Math.ceil(totalChucVu / limitNumber); // Tính số trang

            return res.status(200).json({
                data: fetchAll,
                totalChucVu,
                totalPages,
                currentPage: pageNumber,
                message: "Đã tìm ra tất cả chức vụ",
            });                        

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
            const { page, limit, name, address } = req.query; // Lấy trang và kích thước trang từ query

            // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            // Tính toán số bản ghi bỏ qua
            const skip = (pageNumber - 1) * limitNumber;

            // Tạo query tìm kiếm
            const query = {};
            // Tạo điều kiện tìm kiếm
            if (name || address) {
                const searchKeywords = (name || '') + ' ' + (address || '');
                const keywordsArray = searchKeywords.trim().split(/\s+/);

                const searchConditions = keywordsArray.map(keyword => ({
                    $or: [
                        { name: { $regex: keyword, $options: 'i' } },
                        { address: { $regex: keyword, $options: 'i' } },
                    ]
                }));

                query.$or = searchConditions;
            }

            let fetchAll = await PhongKham.find(query).skip(skip).limit(limitNumber);
            
            const totalPhongKham = await PhongKham.countDocuments(query); // Đếm tổng số chức vụ

            const totalPages = Math.ceil(totalPhongKham / limitNumber); // Tính số trang

            return res.status(200).json({
                data: fetchAll,
                totalPhongKham,
                totalPages,
                currentPage: pageNumber,
                message: "Đã tìm ra tất cả chức vụ",
            });  

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

    createChucVu: async (req, res) => {
        try {
            let {name, description} = req.body               
            
            if (!name) {
                return res.status(400).json({
                    message: "Vui lòng cung cấp đầy đủ thông tin (name)"
                });
            }

            // tìm tên bác sĩ chính xác nếu trùng thì không được thêm
            const existingChucVu = await ChucVu.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
            if (existingChucVu) {
                return res.status(409).json({
                    message: "Tên chức vụ đã tồn tại. Vui lòng sử dụng chức vụ khác."
                });
            }            

            let createChucVu = await ChucVu.create({name, description})
            
            if(createChucVu) {
                console.log("thêm thành công chức vụ");
                return res.status(200).json({
                    data: createChucVu,
                    message: "Thêm chức vụ bác sĩ thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Thêm chức vụ bác sĩ thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi thêm chức vụ bác sĩ.",
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

    updateChucVu: async (req, res) => {
        try {
            let {_id, name, description} = req.body

            console.log("id: ",_id);                     

            let createChucVu = await ChucVu.updateOne({_id: _id},{name, description})
            
            if(createChucVu) {
                console.log("Chỉnh sửa thành công chức vụ");
                return res.status(200).json({
                    data: createChucVu,
                    message: "Chỉnh sửa chức vụ bác sĩ thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Chỉnh sửa chức vụ bác sĩ thất bại"
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
    },

    deleteChucVu: async (req, res) => {
        const _id = req.params.id

        let xoaAD = await ChucVu.deleteOne({_id: _id})

        if(xoaAD) {
            return res.status(200).json({
                data: xoaAD,
                message: "Bạn đã xoá chức vụ bác sĩ thành công!"
            })
        } else {
            return res.status(500).json({
                message: "Bạn đã xoá chức vụ bác sĩ thất bại!"
            })
        }
    }
}