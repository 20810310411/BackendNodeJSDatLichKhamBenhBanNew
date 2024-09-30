const mongoose = require('mongoose');

const BenhNhan_Schema = new mongoose.Schema({   
        email: { type: String,  required: true, },
        matKhau: { type: String, required: true },
        firstName: { type: String },        
        lastName: { type: String },        
        address: { type: String },        
        gender: { type: Boolean, default: true},        
        image: { type: String },  
        roleId: {ref: "Role", type: mongoose.SchemaTypes.ObjectId},                                           
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);
module.exports = mongoose.model("BenhNhan", BenhNhan_Schema);