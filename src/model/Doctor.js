const mongoose = require('mongoose');
const defaultRoleId = new mongoose.Types.ObjectId("66df1d6fdcb551b86e4f703b"); 
const defaultChucVuId = new mongoose.Types.ObjectId("66f7b888ce6c5cdcb1cab057"); 
const Doctor_Schema = new mongoose.Schema({   
        email: { type: String },
        password: { type: String },
        firstName: { type: String },        
        lastName: { type: String },        
        address: { type: String },        
        phoneNumber: { type: String },        
        giaKhamVN: { type: String },        
        giaKhamNuocNgoai: { type: String },        
        chucVuId: [{ref: "ChucVu", type: mongoose.SchemaTypes.ObjectId, default: defaultChucVuId}],    
        gender: { type: Boolean },        
        image: { type: String },         
        chuyenKhoaId: [{ref: "ChuyenKhoa", type: mongoose.SchemaTypes.ObjectId}],                  
        phongKhamId: {ref: "PhongKham", type: mongoose.SchemaTypes.ObjectId},                  
        roleId: {ref: "Role", type: mongoose.SchemaTypes.ObjectId, default: defaultRoleId},  
        mota:   { type: String },           
        thoiGianKham: [
            {
                date: { type: String, required: true }, // Ngày khám
                thoiGianId: [{ ref: "ThoiGianGio", type: mongoose.SchemaTypes.ObjectId }] // Mảng chứa các thoiGianId
            }
        ],      
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);

// // Hàm để xóa các ngày quá hạn
// Doctor_Schema.methods.removeExpiredDates = function() {
//     const today = new Date();
    
//     // Lặp qua mảng thoiGianKham và xóa những ngày quá hạn
//     this.thoiGianKham = this.thoiGianKham.filter(thoiGian => {
//         const dateParts = thoiGian.date.split('-');
//         const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // Chuyển đổi sang Date object
//         console.log("Checking Date:", date);
//         return date >= today; // Giữ lại những ngày chưa qua
//     });
//     console.log("Updated thoiGianKham:", this.thoiGianKham);

// };

// // Trước khi lưu, gọi hàm removeExpiredDates
// Doctor_Schema.pre('save', function(next) {
//     this.removeExpiredDates();
//     next();
// });

module.exports = mongoose.model("Doctor", Doctor_Schema);