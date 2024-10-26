const mongoose = require('mongoose');

const KhamBenh_Schema = new mongoose.Schema({             
        _idDoctor: {ref: "Doctor", type: mongoose.SchemaTypes.ObjectId},     
        _idTaiKhoan: {ref: "BenhNhan", type: mongoose.SchemaTypes.ObjectId},     
        patientName: { type: String },        
        email: { type: String },        
        gender: { type: Boolean },        
        phone: { type: String },        
        dateBenhNhan: { type: String },        
        address: { type: String },        
        lidokham: { type: String },        
        hinhThucTT: { type: Boolean },        
        tenGioKham: { type: String },        
        ngayKhamBenh: { type: String },        
        giaKham: { type: String },        
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);
module.exports = mongoose.model("KhamBenh", KhamBenh_Schema);