const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AccAdmin = require('../../model/AccAdmin'); // Đường dẫn đến model của bạn
const ChuyenKhoa = require('../../model/ChuyenKhoa'); // Đường dẫn đến model của bạn
const ChucVu = require('../../model/ChucVu'); // Đường dẫn đến model của bạn
const Role = require('../../model/Role'); // Đường dẫn đến model của bạn
const Doctor = require('../../model/Doctor');
const ThoiGianGio = require('../../model/ThoiGianGio');
const PhongKham = require('../../model/PhongKham');
require('dotenv').config();
// Secret key cho JWT
const JWT_SECRET = process.env.JWT_SECRET; 
// const moment = require('moment');
const moment = require('moment-timezone');



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
                .populate("chucVuId chuyenKhoaId phongKhamId roleId")
                .populate({
                    path: 'thoiGianKham.thoiGianId', // Đường dẫn đến trường cần populate
                    model: 'ThoiGianGio' // Tên model của trường cần populate
                })
                .skip(skip)
                .limit(limitNumber);

                console.log("fetchAll: ", fetchAll);
                

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
            const { page, limit, name } = req.query; 

            // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10) || 1; // Mặc định là trang 1 nếu không có
            const limitNumber = parseInt(limit, 10) || 10; // Mặc định là 10 bản ghi mỗi trang

            // Tính toán số bản ghi bỏ qua
            const skip = Math.max((pageNumber - 1) * limitNumber, 0);

            // Tạo query tìm kiếm
            const query = {};
            // Tạo điều kiện tìm kiếm
            if (name) {
                const searchKeywords = (name || '')
                const keywordsArray = searchKeywords.trim().split(/\s+/);

                const searchConditions = keywordsArray.map(keyword => ({
                    name: { $regex: keyword, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
                }));

                query.$or = searchConditions;
            }

            let fetchAll = await ChuyenKhoa.find(query).skip(skip).limit(limitNumber);
            
            const totalChuyenKhoa = await ChuyenKhoa.countDocuments(query); // Đếm tổng số chức vụ

            const totalPages = Math.ceil(totalChuyenKhoa / limitNumber); // Tính số trang

            return res.status(200).json({
                data: fetchAll,
                totalChuyenKhoa,
                totalPages,
                currentPage: pageNumber,
                message: "Đã tìm ra tất cả chuyên khoa",
            });             

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

    fetchAllThoiGianGio: async (req, res) => {

        const resGio = await ThoiGianGio.find({})
        if(resGio){
            return res.status(200).json({
                data: resGio,                
                message: "Đã tìm ra tất cả thoi gian",
            });  
        } else {
            return res.status(500).json({
                message: "Có lỗi xảy ra",
            });
        }
    },


    createDoctor: async (req, res) => {
        try {
            let {email, password, firstName, lastName, address, phoneNumber, giaKhamVN, giaKhamNuocNgoai,
                chucVuId, gender, image, chuyenKhoaId, phongKhamId, roleId, mota,  } = req.body

                console.log("chucVuId: ",chucVuId);
                console.log("chuyenKhoaId: ",chuyenKhoaId);
                console.log("giaKhamVN: ",giaKhamVN);
                console.log("giaKhamNuocNgoai: ",giaKhamNuocNgoai);
                
            
            if (!email || !password || !firstName || !lastName) {
                return res.status(400).json({
                    message: "Vui lòng cung cấp đầy đủ thông tin (email, password, firstName, lastName)"
                });
            }

            const existingDoctor = await Doctor.findOne({ email: email });
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
                phongKhamId, roleId, mota, giaKhamVN, giaKhamNuocNgoai,                
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

            // tìm tên chức vụ bác sĩ chính xác nếu trùng thì không được thêm
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

    createPhongKham: async (req, res) => {
        try {
            let {name, address, description , image} = req.body       
            console.log("anhr: ", image);
                    
            
            if (!name || !address) {
                return res.status(400).json({
                    message: "Vui lòng cung cấp đầy đủ thông tin (tên phòng khám, địa chỉ)"
                });
            }                   

            let createPhongKham = await PhongKham.create({name, address, description , image})
            
            if(createPhongKham) {
                console.log("thêm thành công phòng khám");
                return res.status(200).json({
                    data: createPhongKham,
                    message: "Thêm phòng khám thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Thêm phòng khám thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi thêm phòng khám.",
                error: error.message,
            });
        }
    },

    createChuyenKhoa: async (req, res) => {
        try {
            let {name, description , image} = req.body       
            console.log("anhr: ", image);
                 
            // tìm tên chuyên khoa bác sĩ chính xác nếu trùng thì không được thêm
            const existingChuyenKhoa = await ChuyenKhoa.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
            if (existingChuyenKhoa) {
                return res.status(409).json({
                    message: "Tên chuyên khoa đã tồn tại. Vui lòng sử dụng chuyên khoa khác."
                });
            }  
            
            if (!name) {
                return res.status(400).json({
                    message: "Vui lòng cung cấp đầy đủ thông tin (tên chuyên khoa)"
                });
            }                   

            let createChuyenKhoa = await ChuyenKhoa.create({name, description , image})
            
            if(createChuyenKhoa) {
                console.log("thêm thành công chuyên khoa");
                return res.status(200).json({
                    data: createChuyenKhoa,
                    message: "Thêm chuyên khoa thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Thêm chuyên khoa thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi thêm chuyên khoa.",
                error: error.message,
            });
        }
    },


    updateDoctor: async (req, res) => {
        try {
            let {_id, email, password, firstName, lastName, address, phoneNumber, giaKhamVN, giaKhamNuocNgoai, 
                chucVuId, gender, image, chuyenKhoaId, phongKhamId, roleId, mota,} = req.body

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
                giaKhamVN, giaKhamNuocNgoai,                
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

    updatePhongKham: async (req, res) => {
        try {
            let {_id, name, address, description, image} = req.body
            
            let createPhongKham = await PhongKham.updateOne({_id: _id},{name, address, description, image})
            
            if(createPhongKham) {
                console.log("Chỉnh sửa thành công tài khoản");
                return res.status(200).json({
                    data: createPhongKham,
                    message: "Chỉnh sửa phòng khám thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Chỉnh sửa phòng khám thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi Chỉnh sửa phòng khám.",
                error: error.message,
            });
        }
    },

    updateChuyenKhoa: async (req, res) => {
        try {
            let {_id, name, description, image} = req.body
            
            let updateChuyenKhoa = await ChuyenKhoa.updateOne({_id: _id},{name, description, image})
            
            if(updateChuyenKhoa) {
                return res.status(200).json({
                    data: updateChuyenKhoa,
                    message: "Chỉnh sửa chuyên khoa thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Chỉnh sửa chuyên khoa thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi Chỉnh sửa chuyên khoa.",
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
    },

    deletePhongKham: async (req, res) => {
        const _id = req.params.id

        let xoaAD = await PhongKham.deleteOne({_id: _id})

        if(xoaAD) {
            return res.status(200).json({
                data: xoaAD,
                message: "Bạn đã xoá phòng khám thành công!"
            })
        } else {
            return res.status(500).json({
                message: "Bạn đã xoá phòng khám thất bại!"
            })
        }
    },

    deleteChuyenKhoa: async (req, res) => {
        const _id = req.params.id

        let xoaAD = await ChuyenKhoa.deleteOne({_id: _id})

        if(xoaAD) {
            return res.status(200).json({
                data: xoaAD,
                message: "Bạn đã xoá chuyên khoa thành công!"
            })
        } else {
            return res.status(500).json({
                message: "Bạn đã xoá chuyên khoa thất bại!"
            })
        }
    },

    // them thoi gian kham benh cho doctor
    addTimeKhamBenhDoctor: async (req, res) => {
        const { date, time, _id } = req.body; // Lấy _id từ body
        console.log("date: ", date);
        console.log("time: ", time);
        console.log("_id: ", _id);
        
        try {
            // Tìm bác sĩ theo ID
            const doctor = await Doctor.findById(_id);
            if (!doctor) {
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }
    
            // Chuyển đổi ngày từ request
            // const requestDate = moment(date).startOf('day');
            // const requestDate = moment(date).tz('Asia/Bangkok').startOf('day');
            // console.log("requestDate: ", requestDate);
            
    
            // // Kiểm tra xem thời gian đã tồn tại cho ngày này chưa
            // const existingTimeSlot = doctor.thoiGianKham.find(slot => {
            //     const slotDate = moment(slot.date).tz('Asia/Bangkok').startOf('day'); // Đảm bảo so sánh đúng múi giờ
            //     console.log("slotDate: ",slotDate);                
            //     return slotDate.isSame(requestDate, 'day');
            // });

            // Chuyển đổi ngày từ request, đảm bảo đúng định dạng
            const requestDate = moment(date, 'DD-MM-YYYY').startOf('day').format('YYYY-MM-DD');

            if (!moment(requestDate, 'YYYY-MM-DD', true).isValid()) {
                return res.status(400).json({ message: 'Ngày không hợp lệ!' });
            }

            // Xóa các lịch trình cũ
            doctor.thoiGianKham = doctor.thoiGianKham.filter(slot => moment(slot.date).isSameOrAfter(moment(), 'day'));

            // Kiểm tra xem thời gian đã tồn tại cho ngày này chưa
            const existingTimeSlot = doctor.thoiGianKham.find(slot => slot.date === requestDate);

            if (existingTimeSlot) {
                // Lấy mảng các thoiGianId hiện tại
                const existingTimeIds = existingTimeSlot.thoiGianId.map(id => id.toString());
    
                // Lọc ra các thời gian mới không có trong existingTimeIds
                const newTimeIds = time.filter(timeId => !existingTimeIds.includes(timeId));
    
                // Cập nhật thoiGianId với các ID mới
                existingTimeSlot.thoiGianId = [...new Set([...existingTimeSlot.thoiGianId, ...newTimeIds])];
    
                // Xóa đi các thoiGianId không còn trong danh sách mới
                existingTimeSlot.thoiGianId = existingTimeSlot.thoiGianId.filter(timeId => time.includes(timeId.toString()));
            } else {
                // Nếu chưa tồn tại, tạo một lịch khám mới
                // doctor.thoiGianKham.push({ date: requestDate.toDate(), thoiGianId: time });
                doctor.thoiGianKham.push({ date: requestDate, thoiGianId: time });
            }
    
            // Lưu thay đổi
            await doctor.save();
    
            return res.status(200).json({ message: 'Cập nhật lịch trình khám bệnh thành công!', data: doctor });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    },
    
    // xóa lịch trình quá cũ
    deleteOldTimeSlots: async (req, res) => {
        const { _id } = req.body; // Lấy _id từ body
        console.log("_id: ", _id);
        
        try {
            // Tìm bác sĩ theo ID
            const doctor = await Doctor.findById(_id);
            if (!doctor) {
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }
    
            // Xóa các lịch trình cũ
            // doctor.thoiGianKham = doctor.thoiGianKham.filter(slot => moment(slot.date).isSameOrAfter(moment(), 'day'));

            // Lọc các lịch trình đã qua
            const oldSlots = doctor.thoiGianKham.filter(slot => moment(slot.date).isBefore(moment(), 'day'));

            // Kiểm tra xem có lịch trình cũ không
            if (oldSlots.length === 0) {
                return res.status(400).json({ message: 'Không có lịch trình cũ để xóa!' });
            }

            // Xóa các lịch trình cũ
            doctor.thoiGianKham = doctor.thoiGianKham.filter(slot => moment(slot.date).isSameOrAfter(moment(), 'day'));
        
            // Lưu thay đổi
            await doctor.save();
    
            return res.status(200).json({ message: 'Đã xóa các lịch trình cũ thành công!', data: doctor });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    },
        
    // API để lấy thời gian khám của bác sĩ theo ngày
    getTimeSlotsByDoctorAndDate: async (req, res) => {
        const { doctorId, date } = req.query; // Lấy doctorId và date từ query
        console.log("doctorId, date: ", doctorId, date);
        
        try {
            // Tìm bác sĩ theo ID
            const doctor = await Doctor.findById(doctorId);
            if (!doctor) {
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }

            // Chuyển đổi ngày từ query
            const queryDate = moment.utc(date).startOf('day');

            const timeSlot = doctor.thoiGianKham.find(slot => {
                const slotDate = moment.utc(slot.date).startOf('day');
                return slotDate.isSame(queryDate);
            });                                

            if (timeSlot) {
                // Lấy danh sách thoiGianId
                const timeGioIds = timeSlot.thoiGianId;

                // Tìm các tenGio tương ứng với thoiGianId
                const timeGioList = await ThoiGianGio.find({ _id: { $in: timeGioIds } });

                // Tạo mảng các tenGio
                const tenGioArray = timeGioList.map(item => item.tenGio);
                console.log("tenGioArray: ", tenGioArray);
                

                return res.status(200).json({ message: 'Lấy thời gian thành công!', 
                    timeSlots: timeSlot.thoiGianId, 
                    tenGioArray, 
                    timeGioList
                });
            } else {
                return res.status(200).json({ message: 'Không có thời gian khám cho ngày này!', timeSlots: [] });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    },

    // tìm ra doctor để hiển thị chi tiết
    fetchDoctorById: async (req, res) => {

        let id = req.query.id
        console.log("id doctor: ", id);
        try {
            const doctor = await Doctor.findById(id)
                .populate("chucVuId chuyenKhoaId phongKhamId roleId")
                .populate({
                    path: 'thoiGianKham.thoiGianId', // Đường dẫn đến trường cần populate
                    model: 'ThoiGianGio' // Tên model của trường cần populate
                })
            if (!doctor) {
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }
            return res.status(200).json({
                message: "Đã tìm thấy bác sĩ",
                data: doctor
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    },

    // tìm tt bác sĩ khi bệnh nhân đặt lịch (hiển thị lên page đặt lịch)
    fetchDoctorByNgayGio: async (req, res) => {
        try {
            const { id, idGioKhamBenh, ngayKham } = req.query; // Lấy doctorId và date từ query
            console.log("id, idGioKhamBenh, ngayKham: ", id, idGioKhamBenh, ngayKham);

            // Tìm bác sĩ theo ID
            const doctor = await Doctor.findById(id).populate("chucVuId chuyenKhoaId phongKhamId roleId")
            if (!doctor) {
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }

            const timeGio = await ThoiGianGio.findById(idGioKhamBenh);
            if (!timeGio) { 
                return res.status(404).json({ message: 'tên giờ không tồn tại!' });
            }

            return res.status(200).json({ message: 'Da tim thay!', 
                infoDoctor: doctor, 
                tenGio: timeGio,
                ngayKham: ngayKham
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    }
}