const mongoose = require('mongoose');
const ThoiGianGio = require('./ThoiGianGio');
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


// Hàm để xóa các giờ khám đã qua
Doctor_Schema.methods.removeExpiredTimeSlots = async function() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    for (const slot of this.thoiGianKham) {
        const thoiGianGioList = await ThoiGianGio.find({ _id: { $in: slot.thoiGianId } });

        // Lọc các giờ khám không còn hợp lệ
        slot.thoiGianId = slot.thoiGianId.filter(thoiGianId => {
            const thoiGianGio = thoiGianGioList.find(gio => gio._id.equals(thoiGianId));
            if (thoiGianGio) {
                const [start, end] = thoiGianGio.tenGio.split(' - ').map(t => {
                    const [hour, minute] = t.split(':').map(Number);
                    return hour * 60 + minute; // Chuyển đổi sang phút
                });
                return end > currentTimeInMinutes; // Giữ lại những giờ chưa qua
            }
            return false;
        });
    }

    // Lọc những ngày không còn giờ khám nào
    this.thoiGianKham = this.thoiGianKham.filter(slot => slot.thoiGianId.length > 0);
};

// Trước khi lưu, gọi hàm removeExpiredTimeSlots
Doctor_Schema.pre('save', async function(next) {
    await this.removeExpiredTimeSlots();
    next();
});



module.exports = mongoose.model("Doctor", Doctor_Schema);