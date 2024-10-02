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
        chucVuId: [{ref: "ChucVu", type: mongoose.SchemaTypes.ObjectId, default: defaultChucVuId}],    
        gender: { type: Boolean },        
        image: { type: String },         
        chuyenKhoaId: [{ref: "ChuyenKhoa", type: mongoose.SchemaTypes.ObjectId}],                  
        phongKhamId: {ref: "PhongKham", type: mongoose.SchemaTypes.ObjectId},                  
        roleId: {ref: "Role", type: mongoose.SchemaTypes.ObjectId, default: defaultRoleId},  
        mota:   { type: String },           
        thoiGianKhamId: [{ref: "ThoiGianThu", type: mongoose.SchemaTypes.ObjectId}],      
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);
module.exports = mongoose.model("Doctor", Doctor_Schema);