const mongoose = require('mongoose');

const Doctor_Schema = new mongoose.Schema({   
        email: { type: String,  required: true, },
        password: { type: String, required: true },
        firstName: { type: String },        
        lastName: { type: String },        
        address: { type: String },        
        phoneNumber: { type: String },        
        chucVuId: [{ref: "ChucVu", type: mongoose.SchemaTypes.ObjectId}],    
        gender: { type: Boolean, default: true },        
        image: { type: String },         
        chuyenKhoaId: [{ref: "ChuyenKhoa", type: mongoose.SchemaTypes.ObjectId}],                  
        phongKhamId: {ref: "PhongKham", type: mongoose.SchemaTypes.ObjectId},                  
        roleId: {ref: "Role", type: mongoose.SchemaTypes.ObjectId},  
        mota:   { type: String },           
        thoiGianKhamId: [{ref: "ThoiGianThu", type: mongoose.SchemaTypes.ObjectId}],      
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);
module.exports = mongoose.model("Doctor", Doctor_Schema);